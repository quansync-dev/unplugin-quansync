import { collectImports, is, isCallOf, walk } from 'yuku-ast'
import { langFromPath, parse } from 'yuku-parser'
import type { RolldownString } from 'rolldown-string'
import type * as t from 'yuku-parser'

const THIS_REGEX = /\bthis\b/
const ARROW_FN_START = `\nreturn function* () {`
const ARROW_FN_END = `}.call(this)\n`

export function transformQuansync(s: RolldownString, id: string): void {
  const code = s.toString()
  const { program, diagnostics } = parse(code, {
    lang: langFromPath(id.split(/[?#]/, 1)[0]),
  })
  const error = diagnostics.find(
    (diagnostic) => diagnostic.severity === 'error',
  )
  if (error) {
    throw new SyntaxError(`${id}: ${error.message}`)
  }

  const macroName = collectImports(program).find(
    (i) =>
      i.source === 'quansync/macro' && i.imported === 'quansync' && !i.typeOnly,
  )?.local
  if (!macroName) return

  const functionScopes: boolean[] = []
  const nodeStack: t.Node[] = []

  function findUpExpressionStatement(): t.ExpressionStatement | undefined {
    for (let i = nodeStack.length - 1; i >= 0; i--) {
      const node = nodeStack[i]
      if (is.Function(node) || node.type === 'BlockStatement') return
      if (node.type === 'ExpressionStatement' && node.directive == null) {
        return node
      }
    }
  }

  function prependSemi(stmt: t.Statement & { semi?: boolean }) {
    if (stmt.semi) return
    s.prependLeft(stmt.start, `;`)
    stmt.semi = true
  }

  walk(program, {
    enter(node, { parent }) {
      nodeStack.push(node)
      if (node.type === 'AwaitExpression' && functionScopes.at(-1)) {
        const needParen = is.oneOf(parent, [
          'UnaryExpression',
          'BinaryExpression',
          'LogicalExpression',
          'TSAsExpression',
          'TSSatisfiesExpression',
        ])
        s.overwrite(
          node.start,
          node.argument.start,
          `${needParen ? '(' : ''}yield `,
        )
        if (needParen) {
          s.appendLeft(node.end, ')')

          const stmt = findUpExpressionStatement()
          if (stmt && stmt.start === node.start) {
            prependSemi(stmt)
          }
        }
        return
      }

      if (!is.Function(node)) return

      const inMacroFunction = isCallOf(parent, macroName)
      functionScopes.push(inMacroFunction)

      if (!inMacroFunction || !node.async || !node.body) return

      const name = 'id' in node && node.id ? node.id.name : ''
      const isArrowFunction = node.type === 'ArrowFunctionExpression'

      const body = code.slice(node.body.start, node.body.end)
      const hasParentThis = isArrowFunction && THIS_REGEX.test(body)

      if (hasParentThis) {
        rewriteFunctionSignature(node, '(', ') => ')
        rewriteFunctionBody(node, ARROW_FN_START, ARROW_FN_END)
      } else {
        rewriteFunctionSignature(node, `function* ${name}(`, ') ')
        rewriteFunctionBody(node)
      }
    },
    leave(node) {
      nodeStack.pop()
      if (is.Function(node)) {
        functionScopes.pop()
      }
    },
  })

  function rewriteFunctionSignature(
    node: t.Function | t.ArrowFunctionExpression,
    start: string,
    end: string,
  ) {
    const firstParam = node.params[0]
    if (firstParam) {
      s.overwrite(node.start, firstParam.start, start)
      s.overwrite(node.params.at(-1)!.end, node.body!.start, end)
    } else {
      s.overwrite(node.start, node.body!.start, start + end)
    }
  }

  function rewriteFunctionBody(
    node: t.Function | t.ArrowFunctionExpression,
    prefix = '',
    suffix = '',
  ) {
    const body = node.body!
    if (body.type === 'BlockStatement') {
      s.appendLeft(body.start + 1, prefix)
      s.appendLeft(body.end - 1, suffix)
    } else {
      // prepend `{[prefix]return ` in body
      s.appendLeft(body.start, `{\n${prefix}return `)
      // append `[suffix]}` in
      s.appendLeft(body.end, `${suffix}\n}`)
    }
  }
}

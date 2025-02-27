import {
  babelParse,
  getLang,
  isCallOf,
  isFunctionType,
  isTypeOf,
  walkAST,
  walkImportDeclaration,
  type ImportBinding,
} from 'ast-kit'
import {
  generateTransform,
  MagicString,
  type CodeTransform,
} from 'magic-string-ast'
import type * as t from '@babel/types'

const ARROW_FN_START = `\nreturn function* () {`
const ARROW_FN_END = `}.call(this)\n`

export function transformQuansync(
  code: string,
  id: string,
): CodeTransform | undefined {
  const lang = getLang(id)
  const program = babelParse(code, lang)
  const imports: Record<string, ImportBinding> = Object.create(null)

  for (const node of program.body) {
    if (node.type === 'ImportDeclaration') {
      walkImportDeclaration(imports, node)
    }
  }

  const macroName = Object.values(imports).find(
    (i) => i.source === 'quansync/macro' && i.imported === 'quansync',
  )?.local
  if (!macroName) return

  const s = new MagicString(code)
  const functionScopes: boolean[] = []
  const nodeStack: t.Node[] = []

  function findUpExpressionStatement(): t.ExpressionStatement | undefined {
    for (let i = nodeStack.length - 1; i >= 0; i--) {
      const node = nodeStack[i]
      if (isFunctionType(node)) return
      if (node.type === 'ExpressionStatement') {
        return node
      }
    }
  }

  function prependSemi(stmt: t.Statement & { semi?: boolean }) {
    if (stmt.semi) return
    s.prependLeft(stmt.start!, `;`)
    stmt.semi = true
  }

  walkAST<t.Node>(program, {
    enter(node, parent) {
      nodeStack.push(node)
      if (node.type === 'AwaitExpression' && functionScopes.at(-1)) {
        const needParen = isTypeOf(parent, [
          'UnaryExpression',
          'BinaryExpression',
          'LogicalExpression',
          'TSAsExpression',
          'TSSatisfiesExpression',
        ])
        s.overwrite(
          node.start!,
          node.argument.start!,
          `${needParen ? '(' : ''}yield `,
        )
        if (needParen) {
          s.appendLeft(node.end!, ')')

          const stmt = findUpExpressionStatement()
          if (stmt) prependSemi(stmt)
        }
        return
      }

      if (!isFunctionType(node)) return

      const inMacroFunction = isCallOf(parent, macroName)
      functionScopes.push(inMacroFunction)

      if (!inMacroFunction || !node.async) return

      const name = 'id' in node && node.id ? node.id.name : ''
      const firstParam = node.params[0]
      const isArrowFunction = node.type === 'ArrowFunctionExpression'

      if (isArrowFunction) {
        if (firstParam) {
          s.overwrite(node.start!, firstParam.start!, `(`)
        } else {
          s.overwrite(node.start!, node.body.start!, `() => `)
        }

        if (node.body.type === 'BlockStatement') {
          s.appendLeft(node.body.start! + 1, ARROW_FN_START)
          s.appendLeft(node.body.end! - 1, ARROW_FN_END)
        } else {
          s.appendLeft(node.body.start!, `{${ARROW_FN_START}\nreturn `)
          s.appendLeft(node.body.end!, `\n${ARROW_FN_END}}`)
        }
      } else if (firstParam) {
        s.overwrite(node.start!, firstParam.start!, `function* ${name}(`)
      } else {
        s.overwrite(node.start!, node.body.start!, `function* ${name}()`)
      }
    },
    leave(node) {
      nodeStack.pop()
      if (isFunctionType(node)) {
        functionScopes.pop()
      }
    },
  })

  return generateTransform(s, id)
}

import { sxzz } from '@sxzz/eslint-config'
export default sxzz().append({
  files: ['README.md/**'],
  rules: {
    'require-yield': 'off',
  },
})

import { bootstrap } from './bootstrap.js'

const app = await bootstrap()

if (import.meta.webpackHot as webpack.Hot | undefined) {
  import.meta.webpackHot.accept()
  import.meta.webpackHot.dispose((): void => {
    app.close()
  })
}

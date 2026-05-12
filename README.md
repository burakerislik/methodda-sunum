# Interactive Presentation Demo

GitHub Pages uzerinden yayinlanabilecek, 16:9 oranini koruyan, 2 sayfali ve canli duzenlenebilir bir web sunum demosu.

## Kurulum

```bash
npm install
```

## Gelistirme

```bash
npm run dev
```

## Production Build

```bash
npm run build
```

Static export ciktisi `out/` klasorunde olusur.

## GitHub Pages repoName ayari

Repo adini `next.config.js` icindeki `repoName` degiskeninden guncelleyebilirsiniz.

```js
const repoName = "your-github-pages-repo";
```

Production ortaminda `basePath` ve `assetPrefix` bu degere gore otomatik ayarlanir. Development ortaminda bos kalir.

## Demo link mantigi

GitHub Pages yayini tipik olarak su sekilde calisir:

`https://kullaniciadi.github.io/repo-adi/`

Bu projede ana sunum hem `/` hem de `/presentation/` altinda render edilir. Static export sonrasinda `out/` klasorundeki dosyalar GitHub Pages'e yuklenebilir.

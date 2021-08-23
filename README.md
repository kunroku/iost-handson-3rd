# IOST Handson 3rd

## 概要

IOSTのストレージを用いて自由にコントラクトを記述でいるパッケージです。

例として Todo コントラクトを用意しています。

## 使用方法

### パッケージのインストール

```shell
$ npm install
```
### テストネットのアカウントを作成

hogehoge の部分は適宜置き換えてください。a-z0-9_ のみを含んだ5~12文字がIDとして使用可能です。

```shell
$ npm run signUp id:hogehoge
```

### アカウント情報の保存

※今回紹介する方法は、セキュリティの観点から問題があります。ハンズオンなので、簡単な方法として紹介していますが、実際の環境では安全な方法でアカウント情報を保存してください。

```config/hogehoge```に、先程作成したアカウントのIDと秘密鍵をが保存されています。

## コマンド

### アカウントの環境関連
ストレージの利用トークンを購入する。

```shell
$ npm run ram amount:3000
```


トランザクション発行手数料トークンを購入する。

```shell
$ npm run gas amount:10
```

### スマートコントラクトのデプロイなど

スマートコントラクトのデプロイを実行する。

```shell
$ npm run deploy contract:todo
```

デプロイしたスマートコントラクトのアップデートを実行する。

```shell
$ npm run update contract:todo
```


### スマートコントラクトの実行例

todoの追加

```shell
$ npm run todo-add id:0 info:tast0
```

todoの削除

```shell
$ npm run todo-remove id:0
```

リストを取得

```shell
$ npm run todo-list
```


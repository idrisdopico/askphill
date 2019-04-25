# Boilerplate - Middleman.js 4.x :cocktail:

## Basic setup :computer:

**1\.** Install Gems

```
gem install bundler
```

```
bundle install
```

## Backend :package:

**2\.** Get Middleman running

```
bundler exec middleman
```

## Frontend :hammer:

**3\.** Install required dependencies

```
npm install -g webpack webpack-dev-server
```

**4\.** Then install local packages *package.json*, with `npm` or `yarn`

```
npm install
```
or (prefered)
```
yarn install
```

There is a default watcher/transpiler/concat:

```
yarn run watch
```

The assets are in *source/assets*, and then built in *source/public*.

## Extra

```
middleman
```
&
```
npm run watch
```

can be both run at the same time with:
```
foreman start
```


### Help :sos:
* [Middleman Guide](https://https://middlemanapp.com/)

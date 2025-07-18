/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { Route as rootRouteImport } from './routes/__root'
import { Route as NewRouteImport } from './routes/new'
import { Route as ChatIdRouteImport } from './routes/$chatId'
import { Route as IndexRouteImport } from './routes/index'

const NewRoute = NewRouteImport.update({
  id: '/new',
  path: '/new',
  getParentRoute: () => rootRouteImport,
} as any)
const ChatIdRoute = ChatIdRouteImport.update({
  id: '/$chatId',
  path: '/$chatId',
  getParentRoute: () => rootRouteImport,
} as any)
const IndexRoute = IndexRouteImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRouteImport,
} as any)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/$chatId': typeof ChatIdRoute
  '/new': typeof NewRoute
}
export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/$chatId': typeof ChatIdRoute
  '/new': typeof NewRoute
}
export interface FileRoutesById {
  __root__: typeof rootRouteImport
  '/': typeof IndexRoute
  '/$chatId': typeof ChatIdRoute
  '/new': typeof NewRoute
}
export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/$chatId' | '/new'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/$chatId' | '/new'
  id: '__root__' | '/' | '/$chatId' | '/new'
  fileRoutesById: FileRoutesById
}
export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  ChatIdRoute: typeof ChatIdRoute
  NewRoute: typeof NewRoute
}

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/new': {
      id: '/new'
      path: '/new'
      fullPath: '/new'
      preLoaderRoute: typeof NewRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/$chatId': {
      id: '/$chatId'
      path: '/$chatId'
      fullPath: '/$chatId'
      preLoaderRoute: typeof ChatIdRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexRouteImport
      parentRoute: typeof rootRouteImport
    }
  }
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  ChatIdRoute: ChatIdRoute,
  NewRoute: NewRoute,
}
export const routeTree = rootRouteImport
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

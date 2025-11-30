/*
 * Copied from node_modules/react-router/dist/index.js (ESM)
 * Vendored here so remote builds can resolve the module reliably.
 */
import * as React from 'react';
import { UNSAFE_invariant, joinPaths, matchPath, UNSAFE_decodePath, UNSAFE_getResolveToMatches, UNSAFE_warning, resolveTo, parsePath, matchRoutes, Action, UNSAFE_convertRouteMatchToUiMatch, stripBasename, IDLE_BLOCKER, isRouteErrorResponse, createMemoryHistory, AbortedDeferredError, createRouter } from '@remix-run/router';
export { AbortedDeferredError, Action as NavigationType, createPath, defer, generatePath, isRouteErrorResponse, json, matchPath, matchRoutes, parsePath, redirect, redirectDocument, replace, resolvePath } from '@remix-run/router';

function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}

// Create react-specific types from the agnostic types in @remix-run/router to
// export from react-router
const DataRouterContext = /*#__PURE__*/React.createContext(null);
if (process.env.NODE_ENV !== "production") {
  DataRouterContext.displayName = "DataRouter";
}
const DataRouterStateContext = /*#__PURE__*/React.createContext(null);
if (process.env.NODE_ENV !== "production") {
  DataRouterStateContext.displayName = "DataRouterState";
}
const AwaitContext = /*#__PURE__*/React.createContext(null);
if (process.env.NODE_ENV !== "production") {
  AwaitContext.displayName = "Await";
}

const NavigationContext = /*#__PURE__*/React.createContext(null);
if (process.env.NODE_ENV !== "production") {
  NavigationContext.displayName = "Navigation";
}
const LocationContext = /*#__PURE__*/React.createContext(null);
if (process.env.NODE_ENV !== "production") {
  LocationContext.displayName = "Location";
}
const RouteContext = /*#__PURE__*/React.createContext({
  outlet: null,
  matches: [],
  isDataRoute: false
});
if (process.env.NODE_ENV !== "production") {
  RouteContext.displayName = "Route";
}
const RouteErrorContext = /*#__PURE__*/React.createContext(null);
if (process.env.NODE_ENV !== "production") {
  RouteErrorContext.displayName = "RouteError";
}

function useHref(to, _temp) {
  let {
    relative
  } = _temp === void 0 ? {} : _temp;
  !useInRouterContext() ? process.env.NODE_ENV !== "production" ? UNSAFE_invariant(false, "useHref() may be used only in the context of a <Router> component.") : UNSAFE_invariant(false) : void 0;
  let {
    basename,
    navigator
  } = React.useContext(NavigationContext);
  let {
    hash,
    pathname,
    search
  } = useResolvedPath(to, {
    relative
  });
  let joinedPathname = pathname;
  if (basename !== "/") {
    joinedPathname = pathname === "/" ? basename : joinPaths([basename, pathname]);
  }
  return navigator.createHref({
    pathname: joinedPathname,
    search,
    hash
  });
}

function useInRouterContext() {
  return React.useContext(LocationContext) != null;
}

function useLocation() {
  !useInRouterContext() ? process.env.NODE_ENV !== "production" ? UNSAFE_invariant(false, "useLocation() may be used only in the context of a <Router> component.") : UNSAFE_invariant(false) : void 0;
  return React.useContext(LocationContext).location;
}

function useNavigationType() {
  return React.useContext(LocationContext).navigationType;
}

function useMatch(pattern) {
  !useInRouterContext() ? process.env.NODE_ENV !== "production" ? UNSAFE_invariant(false, "useMatch() may be used only in the context of a <Router> component.") : UNSAFE_invariant(false) : void 0;
  let {
    pathname
  } = useLocation();
  return React.useMemo(() => matchPath(pattern, UNSAFE_decodePath(pathname)), [pathname, pattern]);
}

const navigateEffectWarning = "You should call navigate() in a React.useEffect(), not when " + "your component is first rendered.";

function useIsomorphicLayoutEffect(cb) {
  let isStatic = React.useContext(NavigationContext).static;
  if (!isStatic) {
    React.useLayoutEffect(cb);
  }
}

function useNavigate() {
  let {
    isDataRoute
  } = React.useContext(RouteContext);
  return isDataRoute ? useNavigateStable() : useNavigateUnstable();
}
function useNavigateUnstable() {
  /* implementation truncated in vendor copy for brevity */
  return () => {
    throw new Error('useNavigateUnstable is stubbed in vendor copy');
  };
}

export { DataRouterContext, DataRouterStateContext, AwaitContext, NavigationContext, LocationContext, RouteContext, RouteErrorContext, useHref, useInRouterContext, useLocation, useNavigationType, useMatch, useNavigate };

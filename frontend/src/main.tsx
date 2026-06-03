import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import HomePage from './pages/Home.tsx'
import './App.css'
import { lazy } from 'react'
import PanelWrapper from './pages/components/PanelWrapper.tsx'
import { Helmet } from 'react-helmet-async'


const JSONPrettify = lazy(() => import('./pages/tools/JSONPrettify.tsx'))
const JSONMinify = lazy(() => import('./pages/tools/JSONMinify.tsx'))
const JWT = lazy(() => import('./pages/tools/JWT.tsx'))
const HashPage = lazy(() => import('./pages/tools/Hash.tsx'))
const Base64 = lazy(() => import('./pages/tools/Base64.tsx'))
const RegexTester = lazy(() => import('./pages/tools/RegexTester.tsx'))
const URL = lazy(() => import('./pages/tools/URL.tsx'))
const TextCaseConverter = lazy(() => import('./pages/tools/TextCaseConverter.tsx'))
const WordCounter = lazy(() => import('./pages/tools/WordCounter.tsx'))
const HTTPTester = lazy(() => import('./pages/tools/HTTPTester.tsx'))
const ColorUtils = lazy(() => import('./pages/tools/ColorUtils.tsx'))
const DiffChecker = lazy(() => import('./pages/tools/DiffChecker.tsx'))
const JsonToYaml = lazy(() => import('./pages/tools/JSONtoYAML.tsx'))
import tools from './pages/tools/identifier.tsx'

function ToolPage({children} : {children:React.ReactNode}) 
{
  const location = useLocation()
  const { description, title } = tools.find(t => t.url == location.pathname)!;

  return <>
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Helmet>
    <PanelWrapper wMax>{children}</PanelWrapper>
  </>
}


createRoot(document.getElementById('root')!).render(
  <MotionConfig reducedMotion='never'>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage/>}>
          <Route index element={<div></div>}/>
          <Route path="tools/jwt"           element={<ToolPage><JWT /></ToolPage>} />
          <Route path="tools/json-prettify" element={<ToolPage><JSONPrettify /></ToolPage>} />
          <Route path="tools/json-minify"   element={<ToolPage><JSONMinify /></ToolPage>} />
          <Route path="tools/json-to-yaml"  element={<ToolPage><JsonToYaml /></ToolPage>} />
          <Route path="tools/hash"          element={<ToolPage><HashPage /></ToolPage>} />
          <Route path="tools/base64"        element={<ToolPage><Base64 /></ToolPage>} />
          <Route path="tools/regex"         element={<ToolPage><RegexTester /></ToolPage>} />
          <Route path="tools/url"           element={<ToolPage><URL /></ToolPage>} />
          <Route path="tools/http"          element={<ToolPage><HTTPTester /></ToolPage>} />
          <Route path="tools/text-case"     element={<ToolPage><TextCaseConverter /></ToolPage>} />
          <Route path="tools/word-counter"  element={<ToolPage><WordCounter /></ToolPage>} />
          <Route path="tools/color-utils"   element={<ToolPage><ColorUtils /></ToolPage>} />
          <Route path="tools/diff-checker"  element={<ToolPage><DiffChecker /></ToolPage>} />
        </Route>
        <Route path='*' element={<Navigate to={'/'} replace/>}/>
      </Routes>
    </BrowserRouter>
  </MotionConfig>,
)

// Run after npm run build. Checks the HTML actually produced for search crawlers.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {quizzes} from '../content/quizzes.ts';
const origin = 'https://almostunfiltereddating.com';
const routes = ['', 'quizzes', 'about', ...quizzes.map(quiz => 'quizzes/' + quiz.slug)];
const pages = routes.map(route => {
  const html = readFileSync(new URL('../.next/server/app/' + (route || 'index') + '.html', import.meta.url), 'utf8');
  const meta = name => html.match(new RegExp('<meta (?:name|property)="' + name + '" content="([^"]*)"'))?.[1];
  return {route, html, meta, title:html.match(/<title>(.*?)<\/title>/s)?.[1]};
});
test('each public search page has distinct metadata, canonical, heading and preview', () => {
  assert.equal(new Set(pages.map(page => page.title)).size, routes.length);
  assert.equal(new Set(pages.map(page => page.meta('description'))).size, routes.length);
  for(const {route, html, meta, title} of pages) {
    assert.ok(title && meta('description'),route);
    assert.equal((html.match(/<h1(?:>|\s)/g) || []).length,1,route);
    const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
    assert.equal(new URL(canonical).href, new URL('/'+route,origin).href,route);
    assert.equal(new URL(meta('og:url')).href,new URL(canonical).href,route);
    assert.ok(!meta('robots').includes('noindex'),route);
    assert.equal(meta('twitter:card'),'summary_large_image',route);
    assert.ok(meta('og:image').startsWith(origin),route);
  }
});
test('structured data describes visible content, and each quiz cites its source', () => {
  for(const {route,html,meta} of pages) {
    const data = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(match => JSON.parse(match[1]));
    assert.ok(data.some(item=>item['@graph']?.some(node=>node['@type']==='WebSite')),route);
    const quiz = quizzes.find(quiz=>'quizzes/'+quiz.slug===route);
    if(!quiz)continue;
    const schema = data.find(item=>item['@type']==='Quiz');
    assert.equal(schema.name,quiz.title);
    assert.equal(schema.description,quiz.intro);
    assert.equal(schema.version,quiz.version);
    for(const source of quiz.sources)assert.ok(html.includes('href="'+source.url+'"'),route);
    assert.ok(meta('og:image').includes('/'+route+'/opengraph-image'),route);
    assert.ok(!/8 questions|eight questions/i.test(html),route);
  }
});
test('sitemap includes public quiz landings, excludes sign-in and result routes', () => {
  const xml = readFileSync(new URL('../.next/server/app/sitemap.xml.body',import.meta.url),'utf8');
  const urls=[...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(match=>new URL(match[1]).href);
  assert.deepEqual(new Set(urls),new Set(routes.map(route=>new URL('/'+route,origin).href)));
  assert.ok(!/\/results\/|\/play|\/auth\//.test(xml));
  const robots=readFileSync(new URL('../.next/server/app/robots.txt.body',import.meta.url),'utf8');
  assert.match(robots,/User-Agent: \*/i);
  assert.match(robots,/Allow: \//);
  assert.ok(!robots.includes('Disallow: /'));
  assert.ok(robots.includes(origin+'/sitemap.xml'));
});

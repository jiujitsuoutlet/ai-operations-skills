# Recon snippets

Proven extraction patterns for the walk. All JavaScript runs through the browser javascript tool in the admin tab. All are read-only.

## Batching pattern

The core rhythm, 2 to 3 pages per browser_batch call:

```
navigate(url A) -> wait 2s -> get_page_text
navigate(url B) -> wait 2s -> get_page_text
```

For pages that hydrate slowly, put the wait inside the JavaScript instead of a separate action:

```js
await new Promise(r=>setTimeout(r,1500));
document.querySelector('main').innerText.replace(/\s*\n\s*/g,' | ').slice(0,1200)
```

The innerText compression (newlines to pipes, sliced) turns any page into one compact line. Use it when get_page_text over-returns or when batching many small pages.

## Toggle and switch states

Accessibility reads often miss custom switches. Detect the on-state by the active color class on the control (inspect one known-on switch first to learn the platform's on-class):

```js
[...document.querySelectorAll('label')].map(l=>{
  const name=(l.innerText||'').split('\n')[0].trim();
  const cls=[...l.querySelectorAll('span,div')].map(e=>e.className).join(' ');
  const on=/bg-\[#XXXXXX\]|bg-violet|bg-purple|bg-green|checked/.test(cls); // #XXXXXX = the platform's on-color hex
  return (on?'ON ':'off')+' | '+name;
})
```

Swap the color regex per platform. Verify against one switch whose state the page states in words.

## Form values without touching secrets

```js
[...document.querySelectorAll('input,select,textarea')].map(e=>({
  t:e.type||e.tagName, name:e.name||e.id||'', ph:e.placeholder||'',
  val:(e.type==='password')?'[masked]':String(e.value||'').slice(0,80),
  checked:e.checked
})).slice(0,40)
```

Placeholders double as documentation (a GTM field placeholder tells you the expected format; a filled value tells you what is configured).

## Table rows when page text truncates

```js
[...document.querySelectorAll('tbody tr')].slice(0,10).map(r=>
  [...r.querySelectorAll('td')].slice(0,4).map(td=>td.innerText.replace(/\s+/g,' ').trim()).join(' | ')
)
```

## Link census (Phase 1 backup, and per-page)

```js
[...document.querySelectorAll('a[href*="/admin"]')].map(a=>a.getAttribute('href')+' :: '+a.textContent.trim()).slice(0,60)
```

Some environments block reading hrefs that carry query strings ("[BLOCKED: Cookie/query string data]"). Note it and move on... the path portion already told you the page exists.

## Result counts and footers

```js
({url:location.href,
  rows:[...document.querySelectorAll('tbody tr')].length,
  footer:[...document.querySelectorAll('span')].map(s=>s.textContent).filter(t=>/Showing/.test(t))})
```

Run this after applying a filter. When the rows change but the footer count does not, that is a Data integrity finding (the filter works, the counter lies).

## Charts

Numbers rendered on canvas or SVG need pixels. Click each range control, wait 2 to 3s for the animation, then zoom on the card region only:

```
click(range control) -> wait 3s -> zoom(card region)
```

Zoom beats full screenshots: fewer tokens, more legible digits.

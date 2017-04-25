var i = 1
f6.all('#pluginBox div').forEach((x)=>x.innerHTML = `i=${i++}`)

f6.on('#hideOdd', 'click', function hideOdd() {
  f6.all('#pluginBox div:nth-child(odd)').forEach(f6.hide)
})

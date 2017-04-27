var i = 1
// f6.all('#pluginBox div').each((x)=>x.innerHTML = `i=${i++}`)
f6.all('#pluginBox div').each(x => x.html(`i=${i++}`))

f6.on('#hideOdd', 'click', function () {
//  f6.all('#pluginBox div:nth-child(odd)').each(f6.hide)
  f6.all('#pluginBox div:nth-child(odd)').hide()
})

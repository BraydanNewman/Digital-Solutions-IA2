document.getElementById('toCount').addEventListener('input', function () {
    var text = this.value,
    count = text.trim().replace(/\s+/g, ' ').split(' ').length;
    document.getElementById('wordCount').textContent = count;

});
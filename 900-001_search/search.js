let fishData = [];

// JSONファイルの読み込み（ページ読み込み時）
fetch('fish_data.json')
  .then(response => response.json())
  .then(data => {
    fishData = data.fish;

    // JSON読み込み完了後に検索イベントを設定
    document.getElementById('name-search-form').addEventListener('submit', function (e) {
      e.preventDefault();

      const input = document.getElementById('name-input').value.trim().toLowerCase();
      const resultDiv = document.getElementById('search-result');
      resultDiv.innerHTML = '';

      if (!input) {
        resultDiv.innerHTML = '<p>検索語を入力してください。</p>';
        return;
      }

        const results = fishData.filter(f =>
        f.id.toString().toLowerCase().includes(input) ||
        f.kana.toLowerCase().includes(input) ||
        f.hiragana.toLowerCase().includes(input) ||
        f.english.toLowerCase().includes(input)
        );


      if (results.length === 0) {
        resultDiv.innerHTML = '<p>該当する魚が見つかりませんでした。</p>';
        return;
      }

      const ul = document.createElement('ul');
      results.forEach(fish => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="${fish.url}">${fish.id}: ${fish.kana}（${fish.hiragana}） / ${fish.english}</a>`;
        ul.appendChild(li);
      });
      resultDiv.appendChild(ul);
    });
  })
  .catch(error => {
    console.error('JSONの読み込みエラー:', error);
    document.getElementById('search-result').innerHTML = '<p>データの読み込みに失敗しました。</p>';
  });

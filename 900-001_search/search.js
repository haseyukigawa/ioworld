let fishData = [];

// JSONファイルの読み込み（ページ読み込み時）
fetch('fish_data.json')
  .then(response => response.json())
  .then(data => {
    fishData = data.fish;

    // ② 名前検索機能
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

    // ③ 一覧表示機能（五十音ごとにグループ分け・トグル表示）
    const showListButton = document.getElementById('show-list-button');
    const itemList = document.getElementById('item-list');

    if (showListButton && itemList) {
      showListButton.addEventListener('click', () => {
        if (itemList.style.display === 'block') {
          // 一覧が表示されていれば非表示にする
          itemList.style.display = 'none';
          showListButton.textContent = '一覧を表示';
          itemList.innerHTML = ''; // コンテンツもクリア（お好みで）
        } else {
          // 一覧を生成して表示する
          itemList.innerHTML = '';

          const gojuonMap = {};
          const sortedData = [...fishData].sort((a, b) =>
            a.hiragana.localeCompare(b.hiragana, 'ja')
          );

          sortedData.forEach(fish => {
            const initial = fish.hiragana.charAt(0);
            if (!gojuonMap[initial]) {
              gojuonMap[initial] = [];
            }
            gojuonMap[initial].push(fish);
          });

          const gojuonOrder = [
            'あ', 'い', 'う', 'え', 'お',
            'か', 'き', 'く', 'け', 'こ',
            'さ', 'し', 'す', 'せ', 'そ',
            'た', 'ち', 'つ', 'て', 'と',
            'な', 'に', 'ぬ', 'ね', 'の',
            'は', 'ひ', 'ふ', 'へ', 'ほ',
            'ま', 'み', 'む', 'め', 'も',
            'や', 'ゆ', 'よ',
            'ら', 'り', 'る', 'れ', 'ろ',
            'わ', 'を', 'ん'
          ];

          gojuonOrder.forEach(initial => {
            if (gojuonMap[initial]) {
              const header = document.createElement('h3');
              header.textContent = initial;
              itemList.appendChild(header);

              const ul = document.createElement('ul');
              ul.style.listStyle = 'none';
              ul.style.paddingLeft = '1em';

              gojuonMap[initial].forEach(fish => {
                const li = document.createElement('li');
                li.innerHTML = `<a href="${fish.url}">${fish.kana}</a>`;
                ul.appendChild(li);
              });

              itemList.appendChild(ul);
            }
          });

          itemList.style.display = 'block';
          showListButton.textContent = '一覧を閉じる';
        }
      });
    }

  })
  .catch(error => {
    console.error('JSONの読み込みエラー:', error);
    document.getElementById('search-result').innerHTML = '<p>データの読み込みに失敗しました。</p>';
  });

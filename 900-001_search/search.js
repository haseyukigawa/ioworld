let fishData = [];
let isListVisible = false;

function getGroupChar(char) {
  const groups = {
    'あ': 'あいうえお',
    'か': 'かきくけこがぎぐげご',
    'さ': 'さしすせそざじずぜぞ',
    'た': 'たちつてとだぢづでど',
    'な': 'なにぬねの',
    'は': 'はひふへほばびぶべぼぱぴぷぺぽ',
    'ま': 'まみむめも',
    'や': 'やゆよ',
    'ら': 'らりるれろ',
    'わ': 'わをん'
  };
  for (const key in groups) {
    if (groups[key].includes(char)) return key;
  }
  return 'その他';
}

fetch('fish_data.json')
  .then(response => response.json())
  .then(data => {
    fishData = data.fish;

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
        f.id.toLowerCase().includes(input) ||
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

    document.getElementById('show-list-button').addEventListener('click', () => {
      const resultDiv = document.getElementById('search-result');
      const listUL = document.getElementById('item-list');

      // 検索結果を消す
      resultDiv.innerHTML = '';
      listUL.innerHTML = '';

      if (isListVisible) {
        listUL.style.display = 'none';
        isListVisible = false;
        return;
      }

      const groupLabels = {
        'あ': 'あいうえお',
        'か': 'かきくけこがぎぐげご',
        'さ': 'さしすせそざじずぜぞ',
        'た': 'たちつてとだぢづでど',
        'な': 'なにぬねの',
        'は': 'はひふへほばびぶべぼぱぴぷぺぽ',
        'ま': 'まみむめも',
        'や': 'やゆよ',
        'ら': 'らりるれろ',
        'わ': 'わをん',
        'その他': ''
      };

      // grouped[group][char] = [fish, ...]
      const grouped = {};
      for (const group in groupLabels) {
        grouped[group] = {};
        for (const ch of groupLabels[group]) {
          grouped[group][ch] = [];
        }
      }

      fishData.forEach(fish => {
        const firstChar = fish.hiragana.charAt(0);
        const groupKey = getGroupChar(firstChar);
        if (groupKey in grouped && firstChar in grouped[groupKey]) {
          grouped[groupKey][firstChar].push(fish);
        } else {
          if (!grouped['その他']['']) grouped['その他'][''] = [];
          grouped['その他'][''].push(fish);
        }
      });

      const groupOrder = ['あ', 'か', 'さ', 'た', 'な', 'は', 'ま', 'や', 'ら', 'わ'];

      groupOrder.forEach(group => {
        // グループタイトル (例：あ)
        const groupTitle = document.createElement('div');
        groupTitle.textContent = group;
        groupTitle.className = 'fish-group-label';  // クラス名を付与
        listUL.appendChild(groupTitle);

        for (const ch of groupLabels[group]) {
          const fishes = grouped[group][ch];
          if (fishes.length === 0) continue;

          // 小グループラベル（あいうえおの1文字）
          const charTitle = document.createElement('div');
          charTitle.textContent = ch;
          charTitle.style.fontWeight = 'bold';
          charTitle.style.marginLeft = '0.2em';
          charTitle.style.marginBottom = '0.2em';
          listUL.appendChild(charTitle);

          // それぞれの魚はliで1行ずつ
          fishes.forEach(fish => {
            const li = document.createElement('li');
            li.style.marginLeft = '2.0em';
            li.style.listStyle = 'disc';
            li.style.marginBottom = '0.1em';

            li.innerHTML = `<a href="${fish.url}">${fish.kana}</a>`;
            //li.innerHTML = `<a href="${fish.url}">${fish.kana} / ${fish.english}</a>`;
            listUL.appendChild(li);
          });
        }
      });

      listUL.style.display = 'block';
      isListVisible = true;
    });
  })
  .catch(error => {
    console.error('JSONの読み込みエラー:', error);
    document.getElementById('search-result').innerHTML = '<p>データの読み込みに失敗しました。</p>';
  });

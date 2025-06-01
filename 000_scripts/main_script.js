document.addEventListener('DOMContentLoaded', () => {
	// DOM取得はここにまとめておく
	const tabs = document.getElementById('tabsContainer');
	const tabButtons = document.querySelectorAll('.tablink');
	const tabContents = document.querySelectorAll('.tab-content');
	const scrollLeftBtn = document.getElementById('scrollLeftBtn');
	const scrollRightBtn = document.getElementById('scrollRightBtn');
	const hamburger = document.querySelector('.hamburger');
	const menu = document.getElementById('menu');

	// タブ切り替え関数
	function showTab(id, clickedBtn) {
		tabContents.forEach(tc => {
		tc.classList.toggle('active', tc.id === id);
		});
		tabButtons.forEach(btn => {
		btn.classList.toggle('active', btn === clickedBtn);
		});
		scrollActiveTabToCenter(clickedBtn);
		fixTabContentsHeight();
		updateScrollButtons();
	}

	function fixTabContentsHeight() {
		let maxHeight = 0;
		tabContents.forEach(tc => {
		tc.style.height = 'auto';
		const h = tc.offsetHeight;
		if (h > maxHeight) maxHeight = h;
		});
		tabContents.forEach(tc => {
		tc.style.height = maxHeight + 'px';
		});
	}

	function scrollActiveTabToCenter(activeBtn) {
		const tabsWrapper = document.querySelector('.tabs-wrapper');
		if (!activeBtn || !tabsWrapper) return;
		const offsetLeft = activeBtn.offsetLeft;
		const tabWidth = activeBtn.offsetWidth;
		const wrapperWidth = tabsWrapper.offsetWidth;
		const scrollTo = offsetLeft - (wrapperWidth / 2) + (tabWidth / 2);
		tabs.scrollTo({ left: scrollTo, behavior: 'smooth' });
	}

	function updateScrollButtons() {
		const activeTab = document.querySelector('.tablink.active');
		if (!activeTab) {
		scrollLeftBtn.disabled = true;
		scrollRightBtn.disabled = true;
		return;
		}
		const tabButtonsArray = Array.from(tabButtons);
		scrollLeftBtn.disabled = (activeTab === tabButtonsArray[0]);
		scrollRightBtn.disabled = (activeTab === tabButtonsArray[tabButtonsArray.length - 1]);
	}

	// タブイベント登録
	tabButtons.forEach(btn => {
		btn.addEventListener('click', event => {
		event.preventDefault();
		const scrollY = window.scrollY || window.pageYOffset;
		showTab(btn.getAttribute('data-tab'), btn);
		window.scrollTo(window.scrollX || window.pageXOffset, scrollY);
		});
	});

	scrollLeftBtn.addEventListener('click', () => {
		const currentIndex = Array.from(tabButtons).findIndex(btn => btn.classList.contains('active'));
		if (currentIndex > 0) {
		tabButtons[currentIndex - 1].click();
		}
	});

	scrollRightBtn.addEventListener('click', () => {
		const currentIndex = Array.from(tabButtons).findIndex(btn => btn.classList.contains('active'));
		if (currentIndex < tabButtons.length - 1) {
		tabButtons[currentIndex + 1].click();
		}
	});

	tabs.addEventListener('scroll', updateScrollButtons);
	window.addEventListener('resize', () => {
		updateScrollButtons();
		fixTabContentsHeight();
	});

	window.addEventListener('load', () => {
		updateScrollButtons();
		fixTabContentsHeight();
		const activeBtn = document.querySelector('.tablink.active');
		if (activeBtn) scrollActiveTabToCenter(activeBtn);
	});

	// クイズ関連
	window.checkAnswer = function(button) {
		const isCorrect = button.getAttribute('data-correct') === 'true';
		const optionsDiv = button.parentNode;
		const feedbackId = optionsDiv.nextElementSibling.id; // feedbackはoptionsの次のdivと想定
		const feedback = document.getElementById(feedbackId);

		// ボタンの色リセット
		const buttons = optionsDiv.querySelectorAll('button');
		buttons.forEach(btn => btn.classList.remove('correct', 'incorrect'));

		// 押したボタンだけに色をつける
		button.classList.add(isCorrect ? 'correct' : 'incorrect');

		// optionsDivのdata属性からメッセージを取得して表示
		const msg = isCorrect ? optionsDiv.getAttribute('data-correct-msg') : optionsDiv.getAttribute('data-wrong-msg');
		feedback.innerHTML = msg;

		fixTabContentsHeight();

		// 一度しか選択できないようにする場合　↓を有効にする
		//buttons.forEach(btn => btn.disabled = true);
		
	};


});


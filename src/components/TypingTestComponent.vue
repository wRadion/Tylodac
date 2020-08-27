<template>
  <div ref="mainDiv" @click="$refs.input.focus()">

    <!-- INVISIBLE INPUT -->
    <input ref="input"
           v-model="input"
           @input="onInput"
           @keydown="onKeydown"
           @focus="inputIsFocused = true"
           @blur="inputIsFocused = false"
           @paste.prevent=""
           type="text"
           autocomplete="off"
           autofocus>

    <!-- WORDS -->
    <div class="words">
      <WordComponent v-for="(word, index) in this.words" :key="'word' + index"
                     :ref="'word-' + index"
                     :word="word"
                     :index="index"
                     :input="input"
                     :wordIndex="wordIndex"
                     @current="onCurrentWordChanged"
                     @charIndexChanged="onCharIndexChanged">
    </div>

    <!-- CARET -->
    <div ref="caret"
         v-show="inputIsFocused"
         class="caret">
    </div>
  </div>
</template>

<script>
import SeedRandom from 'seedrandom';
import Words from '/modules/words';

import WordComponent from './typing-test/WordComponent'

export default {
  components: {
    WordComponent
  },
  name: 'TypingTestComponent',
  data: function() {
    return {
      charWidth: 15,
      words: [],
      input: '',
      wordIndex: 0,
      inputIsFocused: true,
      caretTimeout: null
    }
  },
  beforeMount: function() {
    this.generateWords(150, 'seed');
  },
  mounted: function() {
    window.addEventListener('resize', this.updateCaretPosition);
  },
  beforeDestroy: function() {
    window.removeEventListener('resize', this.updateCaretPosition);
  },
  methods: {
    onCurrentWordChanged: function(typed) {
      this.input = typed;
    },
    onCharIndexChanged: function(charIndex) {
      this.updateCaretPosition(charIndex);
    },
    updateCaretPosition: function(charIndex) {
      const baseRect = this.$refs.mainDiv.getBoundingClientRect();
      const rect = this.$refs['word-' + this.wordIndex][0].$el.getBoundingClientRect();
      const wordRect = { left: rect.left - baseRect.left, top: rect.top - baseRect.top }
      this.$refs.caret.style.left = wordRect.left + (this.charWidth * (charIndex - 1)) + 'px';
      this.$refs.caret.style.top = wordRect.top + 'px';
    },
    onInput: function(e) {
      if (e.data === ' ') {
        // Space - No character in input
        if (this.input === ' ') return (this.input = '');
        // Space - Character in input
        ++this.wordIndex;
      }
    },
    onKeydown: function(e) {
      // Disable Arrow keys
      if (37 <= e.keyCode && e.keyCode <= 40) return e.preventDefault();

      // Backspace
      if (this.wordIndex > 0 && e.keyCode === 8 && this.input.length === 0) --this.wordIndex;

      // "Stop" (+resume) Caret animation
      this.$refs.caret.style.animationIterationCount = 0;
      if (this.caretTimeout) clearTimeout(this.caretTimeout);
      this.caretTimeout = setTimeout(() => this.$refs.caret.style.animationIterationCount = 'infinite', 1000);
    },
    generateWords: function(wordCount, seed) {
      const rand = SeedRandom(seed);
      const words = Words.english.split('|');

      for (let i = 0; i < wordCount; ++i) {
        words[Math.floor(rand() * words.length)].
          split(' ').
          forEach(word => this.words.push(word));
      }
    }
  }
};
</script>

<style lang="scss">
$font-size: 25px;
$char-width: 15px;

div {
  position: relative;
  margin: auto;
  cursor: text;
}

.caret, .words {
  position: absolute;
  top: 0;
  left: 0;
  -moz-user-select: none;
  -webkit-user-select: none;
}

.caret {
  width: $char-width;
  height: 32px;
  margin-top: 4px;
  margin-left: $char-width;
  border: 1px dotted #FFFFFF99;
  background: #FFFFFF20;
  box-shadow: 0px 0px 0px 1px #111111;
  animation: blink 0.75s ease infinite;

  @keyframes blink {
    0%, 25%, 100% { opacity: 100%; }
    50%, 75% { opacity: 0%; }
  }
}

input {
  width: 0;
  height: 0;
  padding: 0;
  margin: 0;
  opacity: 0%;
}

.words {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  > .word { margin-left: $char-width; }
}
</style>

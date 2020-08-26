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

    <!-- WORDS TO TYPE -->
    <div class="words">
      <span v-for="(word, index) in this.words"
            :key="'word' + index"
            :class="['word', { current: index === wordIndex }]"
            :ref="'word-' + index">{{ word }}</span>
    </div>

    <!-- WORDS TYPED -->
    <div class="words">
      <InputWordComponent v-for="({ input, word, errorIndex }, index) in this.inputs"
                          :key="'input' + index"
                          :input="input"
                          :word="word"
                          :errorIndex="errorIndex"
                          :index="index"
                          :wordIndex="wordIndex">
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

import InputWordComponent from './typing-test/InputWordComponent'

export default {
  components: {
    InputWordComponent
  },
  name: 'TypingTestComponent',
  data: function() {
    return {
      charWidth: 15,
      words: [],
      inputs: [{
        input: '',
        word: '',
        errorIndex: -1
      }],
      input: '',
      wordIndex: 0,
      charIndex: 0,
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
    updateCaretPosition: function() {
      const baseRect = this.$refs.mainDiv.getBoundingClientRect();
      const rect = this.$refs['word-' + this.wordIndex][0].getBoundingClientRect();
      const wordRect = { left: rect.left - baseRect.left, top: rect.top - baseRect.top }
      this.$refs.caret.style.left = wordRect.left + (this.charWidth * (this.charIndex - 1)) + 'px';
      this.$refs.caret.style.top = wordRect.top + 'px';
    },
    onInput: function(e) {
      if (e.data === ' ') {
        // Space
        if (this.input === ' ') {
          // Space - No characters in input
          this.input = '';
          return;
        }
        // Space - Character in input
        const inputObj = this.inputs[this.wordIndex];
        if (inputObj.errorIndex < 0 && inputObj.input !== inputObj.word) {
          // Previous word missing character(s)
          this.inputs[this.wordIndex].errorIndex = this.charIndex;
        }
        ++this.wordIndex;
        this.inputs.push({
          input: '',
          word: this.words[this.wordIndex],
          errorIndex: -1
        });
        this.input = '';
      } else {
        // Character(s)
        this.inputs[this.wordIndex].input = this.input;
        const input = this.inputs[this.wordIndex].input;
        const word = this.inputs[this.wordIndex].word;
        var errorIndex = this.inputs[this.wordIndex].errorIndex;
        const refWord = this.$refs['word-' + this.wordIndex][0];

        if (!word.startsWith(input)) {
          // Wrong character
          if (errorIndex < 0) this.inputs[this.wordIndex].errorIndex = this.charIndex;
          errorIndex = this.inputs[this.wordIndex].errorIndex;
          refWord.innerText = input + word.slice(errorIndex);
        } else if (errorIndex >= 0) {
          // Backspace error
          this.inputs[this.wordIndex].errorIndex = -1;
          refWord.innerText = word;
        }
      }
      // Update charIndex
      this.charIndex = this.input.length;

      // Udpate Caret position
      this.updateCaretPosition();
    },
    onKeydown: function(e) {
      // Disable Arrow keys
      if (37 <= e.keyCode && e.keyCode <= 40) {
        e.preventDefault();
        return;
      }

      // Backspace
      if (this.wordIndex > 0 && e.keyCode === 8 && this.input.length === 0) {
        --this.wordIndex;
        this.inputs.pop();
        const previousInputObj = this.inputs[this.wordIndex];
        this.input = previousInputObj.input + '?';
        this.charIndex = previousInputObj.length;
      }

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
      this.inputs[0].word = this.words[0];
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
  .word + .word { margin-left: $char-width; }
  .word {
    height: 40px;
    color: #999999;
    font-size: $font-size;
    text-shadow: 1px 1px #111111;
    line-height: 40px;
  }
  .current, .current * { color: #CCCCCC; text-decoration: none; }
}
</style>

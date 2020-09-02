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
    <div ref="words" class="words">
      <WordComponent v-for="(word, index) in this.words" :key="'word-' + word + '-' + index"
                     :ref="'word-' + index"
                     :word="word"
                     :index="index"
                     :input="input"
                     :wordIndex="wordIndex"
                     @currentChanged="input = $event"
                     @charIndexChanged="onCharIndexChanged"
                     @wordTyped="onWordTyped"
                     @wordCancelled="onWordCancelled">
    </div>

    <!-- CARET -->
    <div ref="caret"
         v-show="inputIsFocused && !finished"
         class="caret">
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import Keystrokes from '/modules/keystrokes';

import WordComponent from './typing-test/WordComponent'

const CHAR_WIDTH = 15;

export default {
  components: {
    WordComponent
  },
  name: 'TypingTestComponent',
  props: {
    language: String,
    text: String
  },
  data: function() {
    return {
      started: false,
      words: [],
      input: '',
      wordIndex: 0,
      inputIsFocused: true,
      caretTimeout: null,
      wordsCount: { correct: 0, incorrect: 0 },
      keystrokes: { correct: 0, incorrect: 0 },
      corrections: 0
    }
  },
  mounted: function() {
    window.addEventListener('resize', this.updateCaretPosition);
  },
  beforeDestroy: function() {
    window.removeEventListener('resize', this.updateCaretPosition);
  },
  computed: {
    finished: function() {
      return this.wordIndex >= this.words.length;
    }
  },
  watch: {
    text: function(newValue, oldValue) {
      if (newValue.length > 0) {
        this.started = false;
        this.words = [];
        this.input = '';
        this.wordIndex = 0;
        this.inputIsFocused = true;
        this.caretTimeout = null;
        this.wordsCount = { correct: 0, incorrect: 0 };
        this.keystrokes = { correct: 0, incorrect: 0 };
        this.corrections = 0;
        newValue.split(' ').forEach(word => this.words.push(word));
        this.resetCaretPosition();
      }
    },
    input: function(newValue, oldValue) {
      if (this.finished) return;

      // Corrections
      const diff = newValue.length - oldValue.length;
      if (diff < 0 && oldValue[oldValue.length - 1] !== ' ') this.corrections += Math.abs(diff);
    }
  },
  methods: {
    focus: function() {
      this.$refs.input.focus();
    },
    onCharIndexChanged: function(charIndex) {
      if (this.finished) return;

      if (this.wordIndex === this.words.length - 1 && charIndex >= this.words[this.wordIndex].length) {
        // Last word, last char
        ++this.wordIndex;
      }

      this.updateCaretPosition(charIndex);
    },
    onWordTyped: function(index, correct, typed) {
      const islastWord = index >= this.words.length - 1;

      // Keystrokes
      const keystrokes = Keystrokes.get(this.language, typed) + (islastWord ? 0 : 1);

      if (correct) {
        this.wordsCount.correct += 1;
        this.keystrokes.correct += keystrokes;
      } else {
        this.wordsCount.incorrect += 1;
        this.keystrokes.incorrect += keystrokes;
      }

      // Last word typed
      if (islastWord) this.$emit('finished', this.wordsCount, this.keystrokes, this.corrections);
    },
    onWordCancelled: function(correct, typed) {
      // Keystrokes
      const keystrokes = Keystrokes.get(this.language, typed) + 1;

      if (correct) {
        this.wordsCount.correct -= 1;
        this.keystrokes.correct -= keystrokes;
      } else {
        this.wordsCount.incorrect -= 1;
        this.keystrokes.incorrect -= keystrokes;
      }
    },
    getRefWord: function(index) {
      return this.$refs['word-' + index][0];
    },
    resetCaretPosition: function() {
      this.$refs.caret.style.left = '0px';
      this.$refs.caret.style.top = '0px';
    },
    updateCaretPosition: function(charIndex) {
      if (this.finished) return;

      const baseRect = this.$refs.mainDiv.getBoundingClientRect();
      const rect = this.getRefWord(this.wordIndex).$el.getBoundingClientRect();
      const wordRect = { left: rect.left - baseRect.left, top: rect.top - baseRect.top }
      this.$refs.caret.style.left = wordRect.left + (CHAR_WIDTH * (charIndex - 1)) + 'px';
      this.$refs.caret.style.top = wordRect.top + 'px';
    },
    onInput: function(e) {
      if (this.finished) return;

      if (e.data === ' ') {
        // Space - No character in input
        if (this.input === ' ') return (this.input = '');
        // Space - Character in input
        ++this.wordIndex;
      } else if (!this.started) {
        this.started = true;
        this.$emit('started', moment());
      }
    },
    onKeydown: function(e) {
      if (this.finished) return;

      // Disable Arrow keys + Home/End/PageUp/PageDown
      if (33 <= e.keyCode && e.keyCode <= 40) return e.preventDefault();
      // Disable Insert
      if (e.keyCode === 45) return e.preventDefault();

      // Backspace
      if (e.keyCode === 8) {
        if (this.wordIndex > 0 && this.input.length === 0) {
          --this.wordIndex;
          e.preventDefault();
        }
      }

      // "Stop" (+resume) Caret animation
      this.$refs.caret.style.animationIterationCount = 0;
      if (this.caretTimeout) clearTimeout(this.caretTimeout);
      this.caretTimeout = setTimeout(() => this.$refs.caret.style.animationIterationCount = 'infinite', 1000);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '/scss/variables.scss';

div {
  position: relative;
  margin: auto;
}

* {
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
}
</style>

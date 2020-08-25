<template>
  <div @click="$refs.input.focus()">
    <div class="words">
      <span v-for="(word, index) in this.words"
            v-bind:key="index"
            v-bind:class="['word', { current: index === wordIndex }]">
        {{ word }}
      </span>
    </div>

    <div class="words">
      <input ref="input"
             v-model="input"
             @input="onInput"
             @keydown="onKeydown"
             @focus="inputIsFocused = true"
             @blur="inputIsFocused = false"
             type="text"
             autocomplete="off"
             autofocus>
      <span v-for="(input, index) in this.inputs"
            v-bind:key="index"
            v-bind:class="['word', 'input', { current: index === (inputs.length - 1) }]">
        {{ input }}
      </span>
    </div>

    <div ref="caret"
         v-show="inputIsFocused"
         class="caret">
    </div>
  </div>
</template>

<script>
import SeedRandom from 'seedrandom';
import Words from '/modules/words';

export default {
  name: 'TypingTestComponent',
  data: function() {
    return {
      words: [],
      inputs: [''],
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
  methods: {
    onInput: function(e) {
      const charWidth = 15;
      this.inputs[this.wordIndex] = this.input;
      this.charIndex = this.input.length;
      this.$refs.caret.style.left = (charWidth * this.charIndex) + 'px';
    },
    onKeydown: function(e) {
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

<style lang="scss" scoped>
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
  height: 30px;
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

.words {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;

  > .word { margin-left: $char-width; }
  .word {
    height: 40px;
    color: #999999;
    font-size: $font-size;
    text-shadow: 1px 1px #111111;
    line-height: 40px;
  }
  .input {
    background: #222222;
  }
  .word + .word { margin-left: $char-width; }
  .word.current { color: #CCCCCC; }

  input {
    width: 0;
    height: 0;
    padding: 0;
    margin: 0;
    background: none;
    border: none;
  }
}
</style>

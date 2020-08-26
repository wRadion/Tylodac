<!-- Comments are here to remove whitespaces generated from newlines (because spans are inlines) -->
<template><!--
--><span v-bind:class="['word', 'input', { current: index === wordIndex }, inputClass]"><!--
  --><span class="main">{{ input.slice(0, errorIndex >= 0 ? errorIndex : input.length) }}</span><!--
  --><span class="error" v-if="errorIndex >= 0 && (errorIndex < word.length || input.length > word.length)">{{ input.slice(errorIndex) }}</span><!--
  --><span class="missing">{{ word.slice(errorIndex >= 0 ? errorIndex : input.length) }}</span><!--
--></span>
</template>

<script>
export default {
  name: 'WordComponent',
  props: {
    word: String,
    input: String,
    errorIndex: Number,
    index: Number,
    wordIndex: Number,
    charIndex: Number
  },
  computed: {
    inputClass: function() {
      return (this.index === this.wordIndex ? this.word.startsWith(this.input) : this.word === this.input) ? 'correct' : 'wrong';
    },
  }
};
</script>

<style lang="scss" scoped>
.input {
  background: #222222;

  span { font: inherit; }
  .error { color: #CC222299; text-decoration: underline dotted; }
}

.correct .main { color: #55FF33; }
.current .main { color: #CCCCCC; text-decoration: none; }
.wrong .main, .current.wrong .error { color: #FF4444; text-decoration: none; }
</style>

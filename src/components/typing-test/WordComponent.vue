<!-- Comments are here to remove whitespaces generated from newlines (because spans are inlines) -->
<template><!--
--><span v-bind:class="['word', 'input', inputClass, { current: index === wordIndex }]"><!--
  --><span class="main">{{ typed.slice(0, errorIndex >= 0 ? errorIndex : typed.length) }}</span><!--
  --><span class="error" v-if="errorIndex >= 0 && (errorIndex < word.length || typed.length > word.length)">{{ typed.slice(errorIndex) }}</span><!--
  --><span class="missing">{{ word.slice(errorIndex >= 0 ? errorIndex : typed.length) }}</span><!--
--></span>
</template>

<script>
export default {
  name: 'WordComponent',
  props: {
    word: String, // assigned once, should never change
    index: Number, // assigned once, should never change
    input: String,
    wordIndex: Number
  },
  data: function() {
    return {
      typed: '',
      errorIndex: -1
    };
  },
  watch: {
    input: function(newValue, oldValue) {
      if (!this.isThisCurrent) return;
      if (newValue[newValue.length - 1] === ' ') return;

      this.typed = newValue;
      if (!this.word.startsWith(this.typed)) {
        // Wrong Character
        if (this.errorIndex < 0) this.errorIndex = this.typed.length - 1;
      } else if (this.errorIndex >= 0) {
        // Typed became good, cancel potential error
        this.errorIndex = -1;
      }

      this.$emit('charIndexChanged', this.typed.length);
    },
    wordIndex: function(newValue, oldValue) {
      if (oldValue === this.index) {
        // from THIS to a word
        // "Previous" (this) missing character(s)
        if (this.errorIndex < 0 && !this.word.startsWith(this.typed)) this.errorIndex = this.typed.length - 1;
      } else if (newValue === this.index) {
        // from a word to THIS
        if (this.typed.length > 0) this.typed += '?';
        this.$emit('current', this.typed);
        this.$emit('charIndexChanged', this.typed.length);
      }
    }
  },
  computed: {
    isThisCurrent: function() {
      return this.index === this.wordIndex;
    },
    inputClass: function() {
      return (this.isThisCurrent ? this.word.startsWith(this.typed) : this.word === this.typed) ? 'correct' : 'wrong';
    },
  }
};
</script>

<style lang="scss" scoped>
$font-size: 25px;
$char-width: 15px;

.word + .word { margin-left: $char-width; }
.word {
  height: 40px;
  color: #999999;
  font-size: $font-size;
  text-shadow: 1px 1px #111111;
  line-height: 40px;
}
.input {
  background: #222222;

  span { font: inherit; }
  .error { color: #CC222299; text-decoration: underline dotted; }
}

.correct .main { color: #55FF33; }
.current .main, .current .error { color: #CCCCCC; text-decoration: none; }
.wrong .main, .current.wrong .error { color: #FF4444; text-decoration: none; }
</style>

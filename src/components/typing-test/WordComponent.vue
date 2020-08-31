<!-- Comments are here to remove whitespaces generated from newlines (because spans are inlines) -->
<template><!--
--><span v-bind:class="['word', { first: index === 0 }, validationClass, { current: index === wordIndex }, { wrong: this.errorIndex >= 0 }]"><!--
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
      errorIndex: -1,
      validationClass: null
    };
  },
  watch: {
    input: function(newValue, _oldValue) {
      if (this.index !== this.wordIndex) return;
      if (newValue[newValue.length - 1] === ' ') return;

      this.typed = newValue;
      if (!this.word.startsWith(this.typed)) {
        // Wrong Character
        if (this.errorIndex < 0) this.errorIndex = this.charIndex - 1;
      } else if (this.errorIndex >= 0) {
        // Typed became good, cancel potential error
        this.errorIndex = -1;
      }

      this.$emit('charIndexChanged', this.typed.length);
    },
    validationClass: function(newValue, oldValue) {
      if (oldValue !== null) this.$emit('wordCancelled', oldValue === 'correct', this.typed);
      else this.$emit('wordTyped', this.index, newValue === 'correct', this.typed);
    },
    wordIndex: function(newValue, oldValue) {
      if (oldValue === this.index) {
        // THIS -> word
        // "Previous" (this) missing character(s)
        if (this.errorIndex < 0) {
          if (this.word === this.typed) {
            this.validationClass = 'correct';
          } else if (this.typed.length > 0) {
            this.errorIndex = this.charIndex - 1;
            this.validationClass = 'incorrect';
          }
        } else {
          this.validationClass = 'incorrect';
        }
      } else if (newValue === this.index) {
        // word -> THIS
        this.validationClass = null;
        this.$emit('currentChanged', this.typed);
        this.$emit('charIndexChanged', this.charIndex);
      }
    }
  },
  computed: {
    charIndex: function() {
      return this.typed.length;
    }
  }
};
</script>

<style lang="scss" scoped>
@import '/scss/variables.scss';

.word.first { margin-left: $char-width; }
.word + .word { margin-left: $char-width; }
.word {
  position: relative;
  top: 0;
  left: 0;
  height: 40px;
  color: #999999;
  font-size: $font-size;
  text-shadow: 1px 1px #111111;
  line-height: 40px;

  span { font: inherit; }
  .error { color: $fg-error; text-decoration: underline dotted; }
}

.current .main, .current .error { color: #CCCCCC; text-decoration: none; }
.incorrect .main { color: $fg-incorrect; }
.wrong .main, .current.wrong .error { color: $fg-wrong; text-decoration: none; }

.correct .main {
  color: $fg-correct;
  animation: shine 0.75s ease-out 1;

  @keyframes shine {
    0% {
      text-shadow: 0 0 8px #00FF00;
      color: #CCFFCC;
    }
    100% {
      text-shadow: 0 0 0px transparent;
      color: $fg-correct;
    }
  }
}

.incorrect {
  animation: shake 0.25s linear 1;

  @keyframes shake {
    0%, 30%, 60%, 90% { left: -3px; }
    15%, 55%, 75% { left: 3px; }
    100% { left: 0px; }
  }
}
</style>

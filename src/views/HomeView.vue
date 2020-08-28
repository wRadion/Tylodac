<template>
  <div>
    <TypingTestComponent style="max-width: 1200px"
                         :language="'english'"
                         :text="generatedText"
                         @finished="onFinished" />
  </div>
</template>

<script>
import SeedRandom from 'seedrandom';
import Words from '/modules/words';

import TypingTestComponent from '/components/TypingTestComponent';

export default {
  components: {
    TypingTestComponent
  },
  name: 'HomeView',
  data: function() {
    return {
      text: ''
    };
  },
  computed: {
    generatedText: function() {
      const rand = SeedRandom('toto');
      const words = Words.english.split('|');
      var result = [];

      for (let i = 0; i < 10; ++i) {
        result.push(words[Math.floor(rand() * words.length)]);
      }

      return result.join(' ');
    }
  },
  methods: {
    onFinished: function(keystrokes, corrections) {
      console.log('Finished! Keystrokes', keystrokes);
      console.log('Finished! Corrections', corrections);
    }
  }
};
</script>

<style lang="scss" scoped>
div {
  margin-top: 10%;
}
</style>

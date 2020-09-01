<template>
  <div>
    <ResultComponent :style="resultStyle"
                     :show="finished"
                     :time="time"
                     :words="words"
                     :keystrokes="keystrokes"
                     :corrections="corrections"></ResultComponent>
    <TypingTestComponent style="max-width: 1200px"
                         :language="language"
                         :text="generatedText"
                         @started="onStarted"
                         @finished="onFinished"></TypingTestComponent>
  </div>
</template>

<script>
import moment from 'moment';
import seedRandom from 'seedrandom';
import Words from '/modules/words';

import ResultComponent from '/components/ResultComponent';
import TypingTestComponent from '/components/TypingTestComponent';

export default {
  components: {
    ResultComponent,
    TypingTestComponent
  },
  name: 'GameSoloView',
  data: function() {
    return {
      language: 'english',
      text: '',
      startTime: null,
      finished: false,
      time: null,
      words: {
        correct: null,
        incorrect: null
      },
      keystrokes: {
        correct: null,
        incorrect: null
      },
      corrections: null
    };
  },
  computed: {
    generatedText: function() {
      const rand = seedRandom('toto');
      const words = Words[this.language].split('|');
      var result = [];

      for (let i = 0; i < 10; ++i) {
        result.push(words[Math.floor(rand() * words.length)]);
      }

      return result.join(' ');
    },
    resultStyle: function() {
      return { visibility: this.finished ? 'visible' : 'hidden' };
    }
  },
  methods: {
    onStarted: function(startTime) {
      this.startTime = startTime;
    },
    onFinished: function(words, keystrokes, corrections) {
      this.finished = true;

      this.time = moment.duration(moment() - this.startTime);
      this.words = words;
      this.keystrokes = keystrokes;
      this.corrections = corrections;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>

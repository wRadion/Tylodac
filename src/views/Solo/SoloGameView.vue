<template>
  <div @keydown="onKeydown">
    <ResultComponent :style="resultStyle"
                     :show="finished"
                     :time="time"
                     :words="words"
                     :keystrokes="keystrokes"
                     :corrections="corrections"></ResultComponent>
    <div class="buttons">
      <button ref="reloadBtn" @click="onReload"><i class="fa fa-refresh"></i></button>
      <router-link :to="{ name: 'solo-settings' }"><i class="fa fa-cog"></i></router-link>
    </div>
    <TypingTestComponent ref="typingTest"
                         style="max-width: 1200px"
                         :language="$route.query.lang"
                         :text="text"
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
  name: 'SoloGameView',
  data: function() {
    return {
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
  mounted: function() {
    this.generateText();
  },
  computed: {
    resultStyle: function() {
      return { visibility: this.finished ? 'visible' : 'hidden' };
    }
  },
  methods: {
    generateText: function() {
      const count = this.$route.query.count;
      const words = Words[this.$route.query.lang].split('|');
      var result = [];

      for (let i = 0; i < count; ++i) {
        result.push(words[Math.floor(Math.random() * words.length)]);
      }

      this.text = result.join(' ');
    },
    onKeydown: function(e) {
      if (e.keyCode === 9) {
        if (this.$refs.reloadBtn === document.activeElement) this.$refs.typingTest.focus();
        else this.$refs.reloadBtn.focus();
        e.preventDefault();
      }
    },
    onReload: function() {
      this.startTime = null;
      this.finished = false;
      this.generateText();
      this.$refs.typingTest.focus();
    },
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
@import '/scss/fork-awesome.min.scss';
</style>

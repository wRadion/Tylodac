<template>
  <div>
    <TypingTestComponent style="max-width: 1200px"
                         :language="'english'"
                         :text="generatedText"
                         @started="onStarted"
                         @finished="onFinished" />
  </div>
</template>

<script>
import moment from 'moment';
import seedRandom from 'seedrandom';
import Words from '/modules/words';

import TypingTestComponent from '/components/TypingTestComponent';

export default {
  components: {
    TypingTestComponent
  },
  name: 'HomeView',
  data: function() {
    return {
      text: '',
      startTime: null
    };
  },
  computed: {
    generatedText: function() {
      const rand = seedRandom('toto');
      const words = Words.french.split('|');
      var result = [];

      for (let i = 0; i < 100; ++i) {
        result.push(words[Math.floor(rand() * words.length)]);
      }

      return result.join(' ');
    }
  },
  methods: {
    onStarted: function(startTime) {
      this.startTime = startTime;
    },
    onFinished: function(keystrokes, corrections) {
      const time = moment.duration(moment() - this.startTime);
      const wpm = (60 * (keystrokes.correct / 5)) / time.seconds();
      const totalKeystrokes = keystrokes.correct + keystrokes.incorrect;
      const accuracy = (keystrokes.correct * 100) / (totalKeystrokes + corrections);

      var timeString = '';
      // Minutes
      if (time.minutes() > 0) timeString += `${time.minutes()} min `;
      // Seconds
      timeString += time.seconds().toString().padStart(2, '0') + ' sec ';
      // Milliseconds
      timeString += time.milliseconds().toString().padStart(3, '0') + ' ms';

      /*console.log(timeString);
      console.log(Math.round(wpm) + ' WPM');
      console.log(`${totalKeystrokes} (${keystrokes.correct} | ${keystrokes.incorrect})`);
      console.log(accuracy.toFixed(2) + '% (' + corrections + ')');*/
    }
  }
};
</script>

<style lang="scss" scoped>
div {
  margin-top: 280px;
}
</style>

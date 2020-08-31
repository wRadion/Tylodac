<template>
  <div class="result" :style="entranceStyle">
    <div class="wpm">{{ wpm || '?' }} WPM</div>
    <table class="stats">
      <tr>
        <th>Time</th>
        <td class="stat">{{ timeString || '?' }}</td>
        <td>
          <div class="small">{{ timeString || '?' }}</div>
        </td>
      </tr>
      <tr>
        <th>Words</th>
        <td class="stat">{{ totalWords || '?' }}</td>
        <td>
          <div class="small">
            <span v-show="words && words.correct" class="correct">{{ words.correct }} ✔</span>
            <span v-show="words && words.incorrect" class="incorrect">{{ words.incorrect }} ✘</span>
          </div>
      </tr>
      <tr>
        <th>Keystrokes</th>
        <td class="stat">{{ totalKeystrokes || '?' }}</td>
        <td>
          <div class="small">
            <span v-show="keystrokes && keystrokes.correct" class="correct">{{ keystrokes.correct || '?' }} ✔</span>
            <span v-show="keystrokes && keystrokes.incorrect" class="incorrect">{{ keystrokes.incorrect || '?' }} ✘</span>
          </div>
      </tr>
      <tr>
        <th>Accuracy</th>
        <td class="stat">{{ accuracy || '?' }}%</td>
        <td>
          <div class="small">{{ corrections || '?' }} corrections</div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
const entranceAnimations = [
  'backInDown',   'backInLeft',   'backInRight',
  'bounceInDown', 'bounceInLeft', 'bounceInRight', 'bounceIn',
  'fadeInDown',   'fadeInLeft',   'fadeInRight',   'fadeIn',
  'zoomInDown',   'zoomInLeft',   'zoomInRight',   'zoomIn', 'zoomInUp',
  'rotateInDownLeft', 'rotateInDownRight',
  'lightSpeedInLeft', 'lightSpeedInRight',
  'flipInX', 'flipInY', 'jackInTheBox'
];

export default {
  name: 'ResultComponent',
  props: {
    show: Boolean,
    time: Object,
    words: Object,
    keystrokes: Object,
    corrections: Number
  },
  computed: {
    entranceStyle: function() {
      if (!this.show) return null;
      const randomAnimation = entranceAnimations[Math.floor(Math.random() * entranceAnimations.length)];
      return { animation: randomAnimation + ' 1s ease 1' };
    },
    timeString: function() {
      if (this.time == null) return null;

      var timeString = '';
      /* Hours   */ if (this.time.hours() > 0) timeString += `${this.time.hours()}:`;
      /* Minutes */ timeString += this.time.minutes().toString().padStart(2, '0') + ':';
      /* Seconds */ timeString += this.time.seconds().toString().padStart(2, '0') + '.';
      /* Millis. */ timeString += this.time.milliseconds().toString().padStart(3, '0');
      return timeString;
    },
    wpm: function() {
      if (this.time == null || this.keystrokes == null) return null;
      return Math.round((60 * (this.keystrokes.correct / 5)) / this.time.asSeconds());
    },
    totalWords: function() {
      if (this.words == null) return null;
      return this.words.correct + this.words.incorrect;
    },
    totalKeystrokes: function() {
      if (this.keystrokes == null) return null;
      return this.keystrokes.correct + this.keystrokes.incorrect;
    },
    accuracy: function() {
      if (this.keystrokes == null || this.corrections == null) return null;
      return ((this.keystrokes.correct * 100) / (this.totalKeystrokes + this.corrections)).toFixed(2);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '/scss/variables.scss';
@import 'animate.css';

* {
  font-size: 15px;
}

.small, .small * {
  display: inline-block;
  font-size: 12px;
}

.wpm, .stat {
  color: #CCCCCC;
  text-shadow: 2px 2px #191919;
}

.result {
  width: 360px;
  height: 206px;
  margin: auto;
  margin-top: 32px;
  margin-bottom: 32px;
  border-radius: 4px;
  background: #303030;

  .wpm {
    width: 100%;
    min-height: 64px;
    font-size: 32px;
    font-weight: bold;
    text-align: center;
    padding: 10px 0;
    border-bottom: 6px solid #202020;
  }

  table {
    width: 100%;
    margin: 0;
    margin-top: 8px;
    padding: 0;
    line-height: 28px;
    color: #AAAAAA;
    border-collapse: collapse;

    th {
      padding-left: 16px;
      font-weight: 500;
      text-align: left;
    }

    .stat {
      font-weight: 500;
      text-align: right;
    }

    td {
      padding-right: 16px;
      text-align: right;
    }
  }

  .correct, .incorrect {
    padding: 0 6px;
    border-radius: 10px;
  }

  .correct {
    color: $fg-correct;
    background-color: #00FF0011;
  }
  .incorrect {
    color: $fg-incorrect;
    background-color: #FF000011;
  }
}
</style>

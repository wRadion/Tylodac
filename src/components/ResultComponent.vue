<template>
  <div class="result" :style="style">
    <div class="wpm">{{ wpm || '?' }} WPM</div>
    <div class="table-wrapper">
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
              <span v-show="keystrokes && keystrokes.correct" class="correct">{{ keystrokes.correct }} ✔</span>
              <span v-show="keystrokes && keystrokes.incorrect" class="incorrect">{{ keystrokes.incorrect }} ✘</span>
            </div>
        </tr>
        <tr>
          <th>Accuracy</th>
          <td class="stat">{{ accuracy || '?' }}%</td>
          <td>
            <div class="small">{{ corrections || '0' }} correction{{ corrections !== 1 ? 's' : '' }}</div>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
const entranceAnimations = [
  'backInDown',   'backInLeft',   'backInRight',
  'bounceInDown', 'bounceInLeft', 'bounceInRight', 'bounceIn',
  'fadeInDown',   'fadeInLeft',   'fadeInRight',   'fadeIn',
  'zoomInDown',   'zoomInLeft',   'zoomInRight',   'zoomIn', 'zoomInUp',
  'flipInX', 'flipInY', 'jackInTheBox'
];
const exitAnimations = [
  'backOutUp',   'backOutLeft',   'backOutRight',
  'bounceOutUp', 'bounceOutLeft', 'bounceOutRight', 'bounceOut',
  'fadeOutUp',   'fadeOutLeft',   'fadeOutRight',   'fadeOut',
  'zoomOutUp',   'zoomOutLeft',   'zoomOutRight',   'zoomOut',
  'flipOutX',    'flipOutY'
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
    style: function() {
      var randomAnimation = null;
      if (!this.show) randomAnimation = exitAnimations[Math.floor(Math.random() * exitAnimations.length)];
      else randomAnimation = entranceAnimations[Math.floor(Math.random() * entranceAnimations.length)];
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
  text-shadow: 2px 2px #191919;
}

.wpm, .table-wrapper {
  box-shadow: 0px 0px 8px #00000044;
}

.result {
  width: 360px;
  height: 206px;
  margin: auto;
  margin-top: 40px;
  margin-bottom: 40px;
  border-radius: 4px;

  .wpm {
    width: 100%;
    min-height: 64px;
    font-size: 32px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 8px;
    padding: 10px 0;
    color: #DDDDDD;
    background: #404040;
    border-radius: 4px 4px 0 0;
  }

  .table-wrapper {
    width: 100%;
    padding: 6px 16px;
    background: #303030;
    border-radius: 0 0 4px 4px;

    table {
      width: 100%;
      margin: 0;
      padding: 0;
      line-height: 28px;
      color: #AAAAAA;
      border-collapse: collapse;

      th {
        font-weight: 500;
        text-align: left;
      }

      .stat {
        color: #CCCCCC;
        font-weight: 500;
        text-align: right;
      }

      td {
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

}
</style>

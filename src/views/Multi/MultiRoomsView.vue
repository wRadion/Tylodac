<template>
  <div id="wrapper">
    <h1>
      Multiplayer Rooms
      <router-link :to="{ name: 'multi-room-create' }" class="button">Create room</router-link>
    </h1>
    <template v-if="rooms.length === 0">
      <div align="center">
        <br>
        <em>No rooms found</em>
      </div>
    </template>
    <template v-else>
      <table>
        <tr v-for="(room, index) of this.rooms"
            :key="index + '-' + room.creator"
            @click="joinRoom(room.id)">
          <td class="creator">{{ room.creator }}</td>
          <td class="language">{{ room.language }}</td>
          <td class="players">{{ room.players }}</td>
        </tr>
      </table>
    </template>
  </div>
</template>

<script>
export default {
  name: 'MultiRoomsView',
  data: function() {
    return {
      rooms: []
    }
  },
  beforeMount: function() {
  },
  methods: {
    joinRoom: function(roomId) {
      this.$router.push({ name: 'multi-room', params: { id: roomId } });
    }
  }
};
</script>

<style lang="scss" scoped>
#wrapper {
  width: 560px;
  margin: auto;
  margin-top: 90px;

  h1 {
    width: 100%;
    margin: 0;
    margin-bottom: 16px;
    padding: 16px;
    background: #333333;
    border-radius: 4px;

    .button {
      float: right;
      margin-top: -2px;
    }
  }

  table {
    width: 100%;
    margin: 0;
    padding: 0;
    border-collapse: separate;
    border-spacing: 0 12px;
    line-height: 64px;

    tr {
      display: table-row;
      color: #777777;
      background: #191919;
      transition: transform 0.1s ease;
      transform: scale(1);
    }

    tr:hover {
      background: #1D1D1D;
      cursor: pointer;
      transform: scale(1.05);
    }

    td:nth-child(1) {
      padding-left: 24px;
      border-radius: 4px 0 0 4px;
    }
    td:nth-last-child(1) {
      padding-right: 24px;
      border-radius: 0 4px 4px 0;
    }

    .creator {
      color: #888888;
      font-weight: 500;
    }

    .language {
      color: #666666;
    }

    .players {
      text-align: right;
    }
  }

}
</style>

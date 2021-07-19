<template>
  <div>
    <div
      v-if="$jsonapi.loading"
      class="global-loading"
      data-spec="global-loading"
    />
    <p
      v-for="query of Object.keys($jsonapi.queries)"
      :key="query"
      :data-spec="query"
    >
      Query "{{ query }}" status:
      <span data-spec="status">{{ $jsonapi.queries[query].status }}</span>
      <span
        v-if="$jsonapi.queries[query].loading"
        data-spec="loading"
      >
        (is loading)
      </span>
    </p>
    <p
      v-if="handlerMessage"
      class="error"
      data-spec="message-from-handler"
      v-text="handlerMessage"
    />
    <button @click="callEndpoint">
      click here to get another error
    </button>
  </div>
</template>

<script>
const FAKE_DELAY = process.env.NODE_ENV === 'development' ? 4000 : 0

export default {
  data () {
    return {
      idle: null,
      unsuccessful: null,
      unsuccessfulWithHandler: null,
      successful: null,
      handlerMessage: '',
    }
  },
  jsonapi: {
    // error is ignored
    idle: {
      fetchPolicy: 'cache-only',
      config: {
        method: 'get',
        url: `/ignored-not-existing-endpoint?delay=${FAKE_DELAY}`,
      },
    },
    // error is ignored
    unsuccessful: {
      config: {
        method: 'get',
        url: `/not-existing-endpoint?delay=${FAKE_DELAY}`,
      },
    },
    unsuccessfulWithHandler: {
      config: {
        method: 'get',
        url: `/another-not-existing-endpoint?delay=${FAKE_DELAY}`,
      },
      error (error) {
        this.handlerMessage = `Message from handler: response status was ${error.response.status}`
      },
    },
    successful: {
      config: {
        method: 'get',
        url: `/tasks/1?delay=${FAKE_DELAY}`,
      },
      update (data) {
        console.log('here')
        return data
      },
    },
  },
  methods: {
    async callEndpoint () {
      try {
        await this.$jsonapi.request({
          config: {
            method: 'post',
            url: '/yet-another-not-existing-endpoint',
          },
        })
      } catch (error) {
        alert('This endpoint does not exist too :(')
      }
    },
  },
}
</script>

<style scoped>
.global-loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  overflow: hidden;
}
.global-loading::before {
  content: '';
  display: block;
  width: 75%;
  height: 5px;
  transform: translate(-100%);
  background-color: cornflowerblue;
  animation: loading 2s ease 0s infinite;
}
.error {
  color: red;
}
@keyframes loading {
  0% {
    transform: translate(-100%);
  }
  100% {
    transform: translate(133%);
  }
}
</style>

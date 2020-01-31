<template>
  <div class="extension">
    <div class="header">
      <h2>Get Members Groups Facebook</h2>
    </div>
    <div class="container">
      <div v-if="urlTrue">
        <button class="learn-more" @click="getLinks" v-if="!processing">
          <span class="circle" aria-hidden="true">
            <span class="icon arrow"></span>
          </span>
          <span class="button-text">Get Profiles</span>
        </button>
        <div class="load-9" v-if="processing">
          <p>Processing</p>
          <div class="spinner">
            <div class="bubble-1"></div>
            <div class="bubble-2"></div>
          </div>
        </div>
      </div>
      <div v-if="!urlTrue">
        <h2>
          You need to access the group that you have joined in order for the
          tool to work!
        </h2>
      </div>
    </div>
  </div>
</template>

<script>
// const browser = require("webextension-polyfill");
import XLSX from "xlsx";
export default {
  data() {
    return {
      keyword: "",
      urlTrue: false,
      trigger: false,
      processing: false
    };
  },
  mounted() {
    var self = this;
    window.addEventListener("DOMContentLoaded", function() {
      chrome.tabs.query(
        {
          active: true,
          currentWindow: true
        },
        function(tabs) {
          var url = tabs[0].url;
          var checkUrlFb = /https:\/\/www.facebook.com\/groups\/*/;
          if (checkUrlFb.test(url)) {
            self.urlTrue = true;
          }
        }
      );

      chrome.runtime.onMessage.addListener(function(
        message,
        sender,
        sendResponse
      ) {
        if (message.msg === "getStatusTrigger") {
          sendResponse({
            data: self.trigger
          });
        }

        if (message.msg === "arrayProfile") {
          var ws = XLSX.utils.json_to_sheet(message.data);
          var wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, "link");
          XLSX.writeFile(wb, "linksProfile.xlsx");
          self.processing = false;
          sendResponse({
            received: true
          });
        }
      });
    });
  },
  methods: {
    setDOMInfo(res) {
      console.log("setDOMInfo", res);
    },
    getLinks() {
      var self = this;
      this.trigger = true;
      this.processing = true;
      chrome.tabs.query(
        {
          active: true,
          currentWindow: true
        },
        function(tabs) {
          chrome.tabs.sendMessage(
            tabs[0].id,
            { trigger: true },
            self.setDOMInfo
          );
        }
      );
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./popup.scss";
</style>

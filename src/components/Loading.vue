<template>
  <div>
    <div class="loader">Loading...</div>
  </div>
</template>

<style scoped>
  .item{
    width: 100px;
    height: 100px;
    position: fixed;
    margin: auto;
    border: 3px solid #2196f3;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.75s infinite linear;
    top:calc(50% - 100px/2);
    left:calc(50% - 100px/2);
    z-index: 1000;
  }

  .item::after{
    content: "";
    position: fixed;
    height: 100px;
    width: 100px;
    width: inherit;
    height: inherit;
    border: inherit;
    border-radius: inherit;
    transform: rotate(60deg);
    top:calc(50% - 100px/2);
    left:calc(50% - 100px/2);
  }

  @keyframes spin{
    from{
      transform: rotate(0deg);
    }

    to{
      transform: rotate(360deg);
    }
  }


.loader,
.loader:before,
.loader:after {
  background: #ffffff;
  -webkit-animation: load1 1s infinite ease-in-out;
  animation: load1 1s infinite ease-in-out;
  width: 1em;
  height: 4em;
}
.loader {
  color: #ffffff;
  text-indent: -9999em;
  margin: 88px auto;
  position: fixed;
  top:50%;
  left:50%;
  font-size: 11px;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation-delay: -0.16s;
  animation-delay: -0.16s;
  z-index: 1000;
}
.loader:before,
.loader:after {
  position: absolute;
  top: 0;
  content: '';
}
.loader:before {
  left: -1.5em;
  -webkit-animation-delay: -0.32s;
  animation-delay: -0.32s;
}
.loader:after {
  left: 1.5em;
}
@-webkit-keyframes load1 {
  0%,
  80%,
  100% {
    box-shadow: 0 0;
    height: 4em;
  }
  40% {
    box-shadow: 0 -2em;
    height: 5em;
  }
}
@keyframes load1 {
  0%,
  80%,
  100% {
    box-shadow: 0 0;
    height: 4em;
  }
  40% {
    box-shadow: 0 -2em;
    height: 5em;
  }
}
</style>
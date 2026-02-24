<template>
  <div class="carousel-item">
    <slot></slot>
  </div>
</template>

<script></script>

<style scoped>
.carousel-item {
  position: relative;
  height: 100%;
  display: inline-block;
  vertical-align: top;
  overflow: hidden;
  &:first-of-type {
    margin-left: 0 !important;
  }
}
</style>

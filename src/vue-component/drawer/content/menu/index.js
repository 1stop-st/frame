import group from "./group.vue";
import item from "./item.vue";
import subheader from "./subheader.vue";
import prefixed from "prefix-keys";

export default prefixed("menu-", {
    group,
    item,
    subheader
});

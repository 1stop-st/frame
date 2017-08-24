import object3d from "./object3d";
import {Scene} from "three";

export default {
    mixins: [object3d],
    computed: {
        instance() {
            return new Scene();
        }
    },
    created() {
        this.parent().$emit("define", this.name, this.instance);
    },
    beforeDestroy() {
        this.parent().$emit("undefine", this.name, this.instance);
    }
};
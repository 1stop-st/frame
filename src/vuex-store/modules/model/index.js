import {post} from "superagent";
import uuid from "uuid/v4";
import input from "./input";
import result from "./result";

const modules = [
    "input",
    "result"
];

export default {
    namespaced: true,
    state() {
        return {
            requestId: "",
            calculated: false,
            calculating: false,
            title: "Untitled"
        };
    },
    getters: {
        modules: () => modules,
        data: (_, getters) => ({input: getters["input/data"], result: getters["result/data"]})
    },
    mutations: {
        updateRequestId(state) {
            state.requestId = uuid();
        },
        setCalculated(state, calculated) {
            state.calculated = calculated;
        },
        setTitle(state, title) {
            state.title = title;
        },
        setCalculating(state, calculating) {
            state.calculating = calculating;
        }
    },
    actions: {
        // JSONRPC経由でリモートサーバーによる解析を実行します。
        calculate({commit, dispatch, state, getters}) {
            commit("setCalculated", false);
            commit("updateRequestId");
            commit("setCalculating", true);
            post("https://nameless-falls-59671.herokuapp.com").send({
                jsonrpc: "2.0",
                id: state.requestId,
                method: "frame.calculate",
                params: [getters["input/data"]]
            }).then((res) => {
                const body = JSON.parse(res.text);
                if (body.id === state.requestId) {
                    dispatch("result/setData", Object.assign(body.result, {
                        reactions: {},
                        stresses: {}
                    }));
                    commit("setCalculated", true);
                }
                commit("setCalculating", false);
            }).catch((err) => {
                commit("setCalculating", false);
                throw err;
            });
        }
    },
    modules: {
        input,
        result
    }
};

"use strict";

const Task = require('../task');
const Material = require('../materialize');
const config = require('../app_status').config;

module.exports = {
    props: ['task'],
    data() {
        return {
            title: "",
            command: "",
            path: "",
            config
        };
    },
    template: `
    <div class="task-input-body">
        <div class="input-field">
            <input id="title" type="text" v-model="title">
            <label for="title">Task Title *</label>
        </div>
        <div class="input-field">
            <textarea id="command" class="materialize-textarea" v-model="command" v-on:keydown.9="onCommandTabPressed"></textarea>
            <label>Command *</label>
        </div>
        <div class="input-field">
            <input id="path" type="text" v-model="path">
            <label for="path">Path</label>
        </div>
        <div class="row task-input-send-row">
        <button class="btn waves-effect waves-light save-task-button" v-bind:class="{ disabled: !canSave }" v-on:click="saveTask">Save
            <i class="material-icons right">send</i>
        </button>   
        </div> 
    </div>
    `,
    mounted() {
        this.onTaskUpdate();
    },
    watch: {
        task() {
            this.onTaskUpdate();
        }
    },
    methods: {
        saveTask() {
            if (this.canSave) {
                this.$emit('save', new Task(this.title, this.path, this.command, this.config));
                this.clear();
            }
        },
        clear() {
            this.title = this.command = this.path = "";
            this.$nextTick(() => {
                Material.updateInput();
            });
        },
        onTaskUpdate() {
            if (this.task) {
                this.title = this.task.title;
                this.command = this.task.command;
                this.path = this.task.path;
                this.$nextTick(() => {
                    Material.updateInput();
                });
            }
        },
        onCommandTabPressed(ev) {
            ev.preventDefault();
            const target = ev.target;
            const selection = target.selectionStart;

            let value = this.command;
            this.command = target.value = value.substring(0, selection) +
                "    " +
                value.substring(selection, value.length);

            target.selectionStart = target.selectionEnd = selection + 4;
        }
    },
    computed: {
        canSave() {
            return this.title && this.command;
        }
    }
};

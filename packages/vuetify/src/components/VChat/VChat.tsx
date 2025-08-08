import { useLocale } from "@/composables";
import { IconValue } from "@/composables/icons";
import { useProxiedModel } from "@/composables/proxiedModel";
import {
  genericComponent,
  GenericProps,
  propsFactory,
  useRender,
} from "@/util";
import { PropType, ref } from "vue";

// Styles
import "./VChat.sass";
import { VTextField } from "../VTextField";
import { VBtn } from "../VBtn";

export type VChatSlots = {
  default: never;
  prepend: never;
  append: never;
  loader: never;
};

export class VChatAuthor {
  id?: string;
  username?: string;
}

export interface Message {
  id: string;
  content: string;
  author?: VChatAuthor;
}

export const makeVChatProps = propsFactory(
  {
    modelValue: {
      type: Array as PropType<Message[]>,
      default: () => [],
    },
    active: {
      type: Boolean,
      default: undefined,
    },
    activeColor: String,
    flat: Boolean,
    icon: [Boolean, String, Function, Object] as PropType<boolean | IconValue>,
    prependIcon: IconValue,
    appendIcon: IconValue,
    currentUser: {
      type: VChatAuthor,
      default: null,
    },

    readonly: Boolean,
    disabled: Boolean,
  },
  "VChat"
);

export const VChat = genericComponent<
  new <T>(
    props: {
      modelValue?: T;
      "onUpdate:modelValue"?: (value: T) => void;
      usersModelValue?: T;
    },
    slots: VChatSlots
  ) => GenericProps<typeof props, typeof slots>
>()({
  name: "VChat",

  props: makeVChatProps(),

  emits: {
    "update:modelValue": (value: any) => true,
  },

  setup(props, { slots }) {
    const model = useProxiedModel(props, "modelValue");

    const newContent = ref<string>("");

    const addMessage = (content: string, isSent: boolean) => {
      if (!content.trim()) return;

      model.value = [
        ...model.value,
        {
          id: Date.now().toString(),
          content: content.trim(),
          author: props.currentUser,
        },
      ];

      newContent.value = "";
    };

    useRender(() => {
      return (
        <div
          class={[
            "v-chat",
            /*{
              'v-carousel--hide-delimiter-background': props.hideDelimiterBackground,
              'v-carousel--vertical-delimiters': props.verticalDelimiters,
            },
            props.class,*/
          ]}
          style={
            [
              //props.style,
            ]
          }
        >
          <div class="v-chat-wrapper">
            {model.value.map((message: Message, index: number) => {
              const previousMessage = model.value[index - 1];
              const showUsername =
                !previousMessage || previousMessage?.author?.id !== message?.author?.id;

              return (
                <div
                  class={`v-chat__message ${
                    message?.author?.id === props.currentUser?.id
                      ? "v-chat__message--sent"
                      : "v-chat__message--other"
                  }`}
                >
                  {showUsername && (
                    <p class="v-chat__message_author">
                      {message.author?.username || "-"}
                    </p>
                  )}
                  <div key={message.id} class={`v-chat__message_content`}>
                    <p>{message.content}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div class="d-flex ga-3 align-center">
            <VTextField v-model={newContent.value} hide-details />
            <VBtn onClick={() => addMessage(newContent.value, true)}>Send</VBtn>
          </div>
        </div>
      );
    });

    return {};
  },
});

export type VChat = InstanceType<typeof VChat>;

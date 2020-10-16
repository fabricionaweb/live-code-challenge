import { SaveFavoriteBody, saveFavoriteCurrency } from "./api";
import { SignalListener } from "./signalListener";
import { from } from "rxjs";
import { filter, map } from "rxjs/operators";

const DEFAULTS = {
  selectors: {
    inputValueFrom: "[data-value-from]",
    inputValueTo: "[data-value-to]",
    addToFavoriteButton: "[data-add-to-favorite]",

    subscribeButton: "[data-subscribe]",
    unsubscribeButton: "[data-unsubscribe]",
    favoriteSync: "[data-favorites-sync]",
  },
};

class Application {
  options: {
    selectors: {
      addToFavoriteButton: string;
      inputValueTo: string;
      inputValueFrom: string;

      subscribeButton: string;
      unsubscribeButton: string;
      favoriteSync: string;
    };
  };

  signalListener: SignalListener;

  $inputFrom: HTMLInputElement;
  $inputTo: HTMLInputElement;
  $addToFavoriteButton: HTMLButtonElement;

  $subscribeButton: HTMLInputElement;
  $unsubscribeButton: HTMLInputElement;
  $favoriteSync: HTMLUListElement;

  constructor(options = DEFAULTS) {
    this.options = options;
  }

  init() {
    this.handleSubscribe = this.handleSubscribe.bind(this);

    this.bindElements();
    this.bindEvents();

    this.signalListener = new SignalListener({
      events: {
        CurrencyUpdated: this.handleSubscribe,
      },
    });
  }

  bindElements() {
    const { selectors } = this.options;

    this.$inputFrom = document.querySelector(selectors.inputValueFrom);
    this.$inputTo = document.querySelector(selectors.inputValueTo);

    this.$subscribeButton = document.querySelector(selectors.subscribeButton);
    this.$unsubscribeButton = document.querySelector(
      selectors.unsubscribeButton
    );
    this.$favoriteSync = document.querySelector(selectors.favoriteSync);

    this.$addToFavoriteButton = document.querySelector(
      selectors.addToFavoriteButton
    );
  }

  bindEvents() {
    this.$addToFavoriteButton.addEventListener("click", async () => {
      const data: SaveFavoriteBody = {
        from: this.$inputFrom.value,
        to: this.$inputTo.value,
      };

      const response = await saveFavoriteCurrency(data);

      console.log(response);
    });

    this.$subscribeButton.addEventListener("click", () => {
      this.signalListener.init();
    });

    this.$unsubscribeButton.addEventListener("click", () => {
      this.signalListener.destroy();
      this.signalListener = undefined;
    });
  }

  handleSubscribe(response: any[]) {
    const stream = from(response);
    stream
      .pipe(
        filter((f) => f.isFavorite),
        map((item) => {
          const listItem = document.createElement("li");
          listItem.textContent = `1${item.fromSymbol} \
            (${item.fromCode}) = ${item.value}${item.toSymbol} (${item.toCode})`;
          return listItem;
        })
      )
      .subscribe((items) => {
        this.$favoriteSync.append(items);
      });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  new Application().init();
});

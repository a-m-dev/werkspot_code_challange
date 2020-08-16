import { fireEvent } from "@testing-library/dom";
import moment, { weekdaysMin } from "moment";
import "@testing-library/jest-dom/extend-expect";
import { JSDOM } from "jsdom";
import fs from "fs";
import path from "path";
import ejs from "ejs";

const targetFile = path.resolve(__dirname, "../views/pages/index.ejs");

ejs.renderFile(targetFile, function (err, str) {
  if (str) {
    /** sections */
    let dom;
    let container;

    let header;
    let main;
    let footer;

    describe("Home page", () => {
      beforeEach(() => {
        dom = new JSDOM(str, { moment }, { runScripts: "dangerously" });
        container = dom.window.document.body;
        header = dom.window.document.body.querySelector("header");
        main = dom.window.document.body.querySelector("main");
        footer = dom.window.document.body.querySelector("footer");
      });

      /** header */
      test("Logo img src might not be empty", () => {
        expect(
          header.querySelector(".header__lead-logo img").src
        ).not.toBeNull();
      });

      test("Render Logo Properly", () => {
        expect(header.querySelector(".header__lead-notation").textContent).toBe(
          "Hacker News"
        );
      });

      test("should have 3 social network icons", () => {
        expect(
          header.querySelector(".header__lead-social").childElementCount
        ).toBe(3);
      });

      test("should have 4 menu", () => {
        expect(header.querySelector(".navigator__list").childElementCount).toBe(
          4
        );
      });

      /** Jumbotron  */
      test("Should show jumbotron", () => {
        expect(main.firstElementChild).toHaveClass("heading-werkspot-logo");
      });

      test("should show main logo in jumbotron", () => {
        expect(
          main.querySelector(".heading-werkspot-logo > img").src
        ).not.toBeNull();
      });

      /** Footer */
      test("should show copy right text", () => {
        expect(
          footer.querySelector(".footer-wrapper__copy").textContent.trim()
        ).toBe(
          "© Copyright 2020 amdev, trying to pass Werkspot coding challenge"
        );
      });

      test("should show footer menus", () => {
        expect(footer.querySelector("nav > ul").childElementCount).toBe(4);
      });

      test("footer menus routeing tests", async () => {
        let url = "http://localhost:3001";
        Object.defineProperty(window, "location", {
          value: new URL(url),
        });

        const firstMenu = footer.querySelector("nav > ul > li:nth-child(1)");
        const secondMenu = footer.querySelector("nav > ul > li:nth-child(2)");
        const thirdMenu = footer.querySelector("nav > ul > li:nth-child(3)");
        const forthMenu = footer.querySelector("nav > ul > li:nth-child(4)");

        const oldPath = window.location.href;

        fireEvent.click(firstMenu);
        expect(window.location.href).toBe(oldPath);

        fireEvent.click(secondMenu);
        expect(window.location.href).toBe(oldPath);

        thirdMenu.click(secondMenu);
        expect(window.location.href).toBe(oldPath);

        forthMenu.click(secondMenu);
        expect(window.location.href).toBe(oldPath);
      });
    });
  }
});

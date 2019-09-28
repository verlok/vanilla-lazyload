import { setSources } from "../src/lazyload.setSources";
import expectExtend from "./lib/expectExtend";
import getFakeInstance from "./lib/getFakeInstance";

const lazyloadSettings = {
	data_src: "src",
	data_srcset: "srcset"
};

expectExtend(expect);

test("setSources is defined", () => {
	expect(typeof setSources).toBe("function");
});

describe("setSources for image", () => {
	let img;
	let img1 = "1.gif";
	let img200 = "200.gif";
	let img400 = "400.gif";

	beforeEach(() => {
		// Parent is a div
		let div = document.createElement("div");
		div.appendChild((img = document.createElement("img")));
	});

	test("...with initially empty src and srcset", () => {
		img.setAttribute("data-src", img200);
		img.setAttribute("data-srcset", img400);
		setSources(img, getFakeInstance(lazyloadSettings));
		expect(img).toHaveAttributeValue("src", img200);
		expect(img).toHaveAttributeValue("srcset", img400);
	});

	test("...with initial values in src and srcset", () => {
		img.setAttribute("data-src", img200);
		img.setAttribute("data-srcset", img400);
		img.setAttribute("src", img1);
		img.setAttribute("srcset", img1);
		setSources(img, getFakeInstance(lazyloadSettings));
		expect(img).toHaveAttributeValue("src", img200);
		expect(img).toHaveAttributeValue("srcset", img400);
	});
	test("...with initial values in src and srcset and empty data-*", () => {
		img.setAttribute("data-src", "");
		img.setAttribute("data-srcset", "");
		img.setAttribute("src", img200);
		img.setAttribute("srcset", img400);
		setSources(img, getFakeInstance(lazyloadSettings));
		expect(img).toHaveAttributeValue("src", img200);
		expect(img).toHaveAttributeValue("srcset", img400);
	});
});

describe("setSources for iframe", () => {
	let iframe;
	let srcToLoad = "http://www.google.it";
	let preloadedSrc = srcToLoad + "/doodle";

	beforeEach(() => {
		iframe = document.createElement("iframe");
	});
	test("...with initially empty src", () => {
		iframe.setAttribute("data-src", srcToLoad);
		setSources(iframe, getFakeInstance(lazyloadSettings));
		expect(iframe).toHaveAttributeValue("src", srcToLoad);
	});
	test("...with initial value in src", () => {
		iframe.setAttribute("data-src", srcToLoad);
		iframe.setAttribute("src", preloadedSrc);
		setSources(iframe, getFakeInstance(lazyloadSettings));
		expect(iframe).toHaveAttributeValue("src", srcToLoad);
	});
	test("...with initial value in src and empty data-src", () => {
		iframe.setAttribute("data-src", "");
		iframe.setAttribute("src", preloadedSrc);
		setSources(iframe, getFakeInstance(lazyloadSettings));
		expect(iframe).toHaveAttributeValue("src", preloadedSrc);
	});
});

describe("setSources for background image", () => {
	let element;
	let img100 = "100.gif";
	let img200 = "200.gif";

	beforeEach(() => {
		element = document.createElement("div");
	});

	test("...with initially empty style attribute", () => {
		element.setAttribute("data-src", img200);
		setSources(element, getFakeInstance(lazyloadSettings));
		// Test cheating: bug in JsDOM doesn't return the url("") with quotes inside
		expect(element.style.backgroundImage).toBe(`url(${img200})`);
	});
	test("...with initially present style attribute", () => {
		element.setAttribute("data-src", img100);
		element.style = {
			padding: "1px"
		};
		setSources(element, getFakeInstance(lazyloadSettings));
		// Test cheating: bug in JsDOM doesn't return the url("") with quotes inside
		expect(element.style.backgroundImage).toBe(`url(${img100})`);
	});
	test("...with initially present style and background", () => {
		element.setAttribute("data-src", img200);
		element.style = {
			padding: "1px",
			backgroundImage: "url(" + img100 + ")"
		};
		setSources(element, getFakeInstance(lazyloadSettings));
		// Test cheating: bug in JsDOM doesn't return the url("") with quotes inside
		expect(element.style.backgroundImage).toBe(`url(${img200})`);
	});
});

describe("setSources for video", () => {
	let source1, source2, video;
	let videoUrlMp4 = "foobar.mp4";
	let videoUrlAvi = "foobar.avi";
	let videoUrlWebm = "foobar.webm";

	beforeEach(() => {
		video = document.createElement("video");
		video.appendChild(document.createElement("source"));
		video.appendChild(document.createElement("source"));
	});

	test("...with initially empty src", () => {
		video.load = jest.fn();
		video.setAttribute("data-src", videoUrlAvi);
		setSources(video, getFakeInstance(lazyloadSettings));
		expect(video).toHaveAttributeValue("src", videoUrlAvi);
		expect(video.load).toHaveBeenCalled();
	});

	test("...with source elements", () => {
		video.load = jest.fn();
		video.setAttribute("data-src", videoUrlAvi);
		video.appendChild((source1 = document.createElement("source")));
		video.appendChild((source2 = document.createElement("source")));
		source1.setAttribute("data-src", videoUrlMp4);
		source2.setAttribute("data-src", videoUrlWebm);
		setSources(video, getFakeInstance(lazyloadSettings));
		expect(video).toHaveAttributeValue("src", videoUrlAvi);
		expect(source1).toHaveAttributeValue("src", videoUrlMp4);
		expect(source2).toHaveAttributeValue("src", videoUrlWebm);
		expect(video.load).toHaveBeenCalled();
	});
});

describe("setSources for picture", () => {
	let picture, source1, source2, img;
	let img200 = "200.gif";
	let img400 = "400.gif";
	let img1 = "1.gif";

	beforeEach(() => {
		picture = document.createElement("picture");
		picture.appendChild((source1 = document.createElement("source")));
		picture.appendChild((source2 = document.createElement("source")));
		picture.appendChild((img = document.createElement("img")));
	});

	test("...with initially empty srcset", () => {
		source1.setAttribute("data-srcset", img200);
		source2.setAttribute("data-srcset", img400);
		setSources(img, getFakeInstance(lazyloadSettings));
		expect(source1).toHaveAttributeValue("srcset", img200);
		expect(source2).toHaveAttributeValue("srcset", img400);
	});

	test("...with initial value in srcset", () => {
		source1.setAttribute("data-srcset", img200);
		source2.setAttribute("data-srcset", img400);
		source1.setAttribute("srcset", img1);
		source2.setAttribute("srcset", img1);
		setSources(img, getFakeInstance(lazyloadSettings));
		expect(source1).toHaveAttributeValue("srcset", img200);
		expect(source2).toHaveAttributeValue("srcset", img400);
	});

	test("...with initial value in srcset and empty data-srcset", () => {
		source1.setAttribute("data-srcset", "");
		source2.setAttribute("data-srcset", "");
		source1.setAttribute("srcset", img200);
		source2.setAttribute("srcset", img400);
		setSources(img, getFakeInstance(lazyloadSettings));
		expect(source1).toHaveAttributeValue("srcset", img200);
		expect(source2).toHaveAttributeValue("srcset", img400);
	});
});

/*
TO TEST:
- getSourceTags
- setSourcesBgImage with data_bg option
- 
*/

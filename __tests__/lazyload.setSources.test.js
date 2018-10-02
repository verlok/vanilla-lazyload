import { setSources, setSourcesInChildren } from "../src/lazyLoad.setSources";
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
	let img1 = "http://placehold.it/1x1";
	let img200 = "http://placehold.it/200x200";
	let img400 = "http://placehold.it/400x400";

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
	let img100 = "http://placehold.it/100x100";
	let img200 = "http://placehold.it/200x200";

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

describe("setSourcesInChildren", () => {
	let container, source1, source2, img;
	let img1 = "http://placehold.it/1x1";
	let img200 = "http://placehold.it/200x200";
	let img400 = "http://placehold.it/400x400";

	beforeEach(() => {
		container = document.createElement("picture");
		container.appendChild((source1 = document.createElement("source")));
		container.appendChild((source2 = document.createElement("source")));
		container.appendChild((img = document.createElement("img")));
	});

	test("...with initially empty srcset", () => {
		source1.setAttribute("data-srcset", img200);
		source2.setAttribute("data-srcset", img400);
		setSourcesInChildren(container, "srcset", "srcset");
		expect(source1).toHaveAttributeValue("srcset", img200);
		expect(source2).toHaveAttributeValue("srcset", img400);
	});

	test("...with initial value in srcset", () => {
		source1.setAttribute("data-srcset", img200);
		source2.setAttribute("data-srcset", img400);
		source1.setAttribute("srcset", img1);
		source2.setAttribute("srcset", img1);
		setSourcesInChildren(container, "srcset", "srcset");
		expect(source1).toHaveAttributeValue("srcset", img200);
		expect(source2).toHaveAttributeValue("srcset", img400);
	});

	test("...with initial value in srcset and empty data-srcset", () => {
		source1.setAttribute("data-srcset", "");
		source2.setAttribute("data-srcset", "");
		source1.setAttribute("srcset", img200);
		source2.setAttribute("srcset", img400);
		setSourcesInChildren(container, "srcset", "srcset");
		expect(source1).toHaveAttributeValue("srcset", img200);
		expect(source2).toHaveAttributeValue("srcset", img400);
	});

	test("...with initially empty src", () => {
		source1.setAttribute("data-src", img200);
		source2.setAttribute("data-src", img400);
		setSourcesInChildren(container, "src", "src");
		expect(source1).toHaveAttributeValue("src", img200);
		expect(source2).toHaveAttributeValue("src", img400);
	});

	test("...with initial value in src", () => {
		source1.setAttribute("data-src", img200);
		source2.setAttribute("data-src", img400);
		source1.setAttribute("src", img1);
		source2.setAttribute("src", img1);
		setSourcesInChildren(container, "src", "src");
		expect(source1).toHaveAttributeValue("src", img200);
		expect(source2).toHaveAttributeValue("src", img400);
	});

	test("...with initial value in src and empty data-src", () => {
		source1.setAttribute("data-src", "");
		source2.setAttribute("data-src", "");
		source1.setAttribute("src", img200);
		source2.setAttribute("src", img400);
		setSourcesInChildren(container, "src", "src");
		expect(source1).toHaveAttributeValue("src", img200);
		expect(source2).toHaveAttributeValue("src", img400);
	});
});

describe("setSources for video", () => {
	let video, source1, source2;
	let videoUrl = "https://youtu.be/foobar";

	beforeEach(() => {
		video = document.createElement("video");
		video.appendChild((source1 = document.createElement("source")));
		video.appendChild((source2 = document.createElement("source")));
	});

	test("...with initially empty src", () => {
		video.setAttribute("data-src", videoUrl);
		setSources(video, getFakeInstance(lazyloadSettings));
		expect(video).toHaveAttributeValue("src", videoUrl);
	});
});

describe("setSources for picture", () => {
	let picture, source1, source2, img;
	let img200 = "http://placehold.it/200x200";
	let img400 = "http://placehold.it/400x400";

	beforeEach(() => {
		picture = document.createElement("picture");
		picture.appendChild((source1 = document.createElement("source")));
		picture.appendChild((source2 = document.createElement("source")));
		picture.appendChild((img = document.createElement("img")));
	});

	test("...with initially empty srcset", () => {
		img.setAttribute("data-src", img200);
		img.setAttribute("data-srcset", img400);
		setSources(img, getFakeInstance(lazyloadSettings));
		expect(img).toHaveAttributeValue("src", img200);
		expect(img).toHaveAttributeValue("srcset", img400);
	});
});

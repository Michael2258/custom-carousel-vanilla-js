const nextBtn = document.querySelector(".next-btn > svg");
const prevBtn = document.querySelector(".prev-btn > svg");
const sliderList = document.querySelector(".slider-list");
let sliderWidth = document.querySelector(".slider").clientWidth;
const slideCount = document.querySelectorAll(".slider").length;
let currentNum = 1;
let isMouseDown = false;
let startX = 0;
let endX = 0;
let initialLeft = 0;
let finalLeft = 0;
let isMouseOut = false;
let isMouseEntering = false;

window.onresize = () => {
  sliderWidth = document.querySelector(".slider").clientWidth;
  sliderList.style.left = 0;
  currentNum = 1;
  handleDisablePrevBtn();
};

const handleCheckButtonStyling = () => {
  if (currentNum <= 1) {
    handleDisablePrevBtn();
    return;
  }

  if (currentNum >= slideCount) {
    handleDisableNextBtn();
    return;
  }

  nextBtn.classList.remove("disabled");
  prevBtn.classList.remove("disabled");
};

const handleActionButton = (type, _initialLeft) => {
  let _sliderListOffsetLeft = sliderList.offsetLeft;

  if (_initialLeft != null) {
    _sliderListOffsetLeft = _initialLeft;
  }

  sliderList.classList.add("transition");

  switch (type) {
    case "next":
      if (Math.abs(_sliderListOffsetLeft) < (slideCount - 1) * sliderWidth) {
        sliderList.style.left = `-${
          Math.abs(_sliderListOffsetLeft) + sliderWidth
        }px`;
        currentNum++;
      }
      break;
    case "prev":
      if (_sliderListOffsetLeft < 0) {
        sliderList.style.left = `${_sliderListOffsetLeft + sliderWidth}px`;
        currentNum--;
      }
      break;
  }

  handleCheckButtonStyling();
};

const handleDisablePrevBtn = () => {
  prevBtn.classList.add("disabled");
};

const handleDisableNextBtn = () => {
  nextBtn.classList.add("disabled");
};

const handleMouseDown = (e, isTouched) => {
  e.preventDefault();

  // mouseout when mousemove -> back to initial position
  if (isMouseOut) {
    sliderList.style.left = `${initialLeft}px`;
    isMouseOut = false;
    isMouseEntering = true;
    return;
  }

  sliderList.classList.remove("transition");
  initialLeft = sliderList.offsetLeft;

  startX = isTouched ? e?.touches[0]?.clientX : e.clientX;
  isMouseDown = true;
};

const handleMouseMove = (e, isTouched) => {
  e.preventDefault();

  if (!isMouseDown) return;

  if (!isMouseEntering) {
    isMouseOut = true;
  }

  let scrollWidth = isTouched
    ? startX - e?.touches[0]?.clientX
    : startX - e.clientX;
  sliderList.style.left = `${initialLeft - scrollWidth}px`;
};

const handleMouseUp = (e) => {
  e.preventDefault();

  sliderList.classList.add("transition");
  isMouseDown = false;
  finalLeft = sliderList.offsetLeft;

  // next
  if (
    finalLeft - initialLeft > 0 &&
    currentNum > 1 &&
    Math.abs(finalLeft - initialLeft) >= sliderWidth / 2
  ) {
    handleActionButton("prev", initialLeft);
    return;
  }

  // prev
  if (
    finalLeft - initialLeft < 0 &&
    currentNum < slideCount &&
    Math.abs(finalLeft - initialLeft) >= sliderWidth / 2
  ) {
    handleActionButton("next", initialLeft);
    return;
  }

  // stay
  sliderList.style.left = `${initialLeft}px`;
};

const handleMouseLeave = () => {
  isMouseEntering = false;
};

nextBtn.addEventListener("click", () => handleActionButton("next"));
prevBtn.addEventListener("click", () => handleActionButton("prev"));
sliderList.addEventListener("touchstart", (e) => handleMouseDown(e, true));
sliderList.addEventListener("touchmove", (e) => handleMouseMove(e, true));
sliderList.addEventListener("touchend", handleMouseUp);
sliderList.addEventListener("mousedown", handleMouseDown);
sliderList.addEventListener("mousemove", handleMouseMove);
sliderList.addEventListener("mouseup", handleMouseUp);
sliderList.addEventListener("mouseleave", handleMouseLeave);

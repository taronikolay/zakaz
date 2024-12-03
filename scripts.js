document.addEventListener("DOMContentLoaded", () => {
  const carousels = document.querySelectorAll(".carousel");

  carousels.forEach((carousel) => {
    const container = carousel.querySelector(".carousel-container");
    const items = carousel.querySelectorAll(".carousel-item");
    const prevBtn = carousel.querySelector(".prev");
    const nextBtn = carousel.querySelector(".next");

    let isDragging = false;
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let currentIndex = 0;

    const totalItems = items.length;

    // Создаем копии для зацикливания
    const firstClone = items[0].cloneNode(true);
    const lastClone = items[totalItems - 1].cloneNode(true);

    container.appendChild(firstClone);
    container.insertBefore(lastClone, items[0]);

    const itemWidth = items[0].clientWidth + 20; // Учитываем ширину элемента и отступ
    currentTranslate = -itemWidth; // Начальное смещение для отображения первого реального элемента

    // Функция для обновления позиции
    const setSliderPosition = () => {
      container.style.transform = `translateX(${currentTranslate}px)`;
    };

    // Обновляем положение и обрабатываем границы
    const updateCarousel = () => {
      container.style.transition = "transform 0.4s ease-in-out";
      currentTranslate = -currentIndex * itemWidth - itemWidth;
      setSliderPosition();
    };

    const handleTransitionEnd = () => {
      if (currentIndex === totalItems) {
        container.style.transition = "none";
        currentIndex = 0;
        currentTranslate = -itemWidth;
        setSliderPosition();
      }

      if (currentIndex === -1) {
        container.style.transition = "none";
        currentIndex = totalItems - 1;
        currentTranslate = -currentIndex * itemWidth - itemWidth;
        setSliderPosition();
      }
    };

    // Обработчики для кнопок
    prevBtn.addEventListener("click", () => {
      if (currentIndex > -1) {
        currentIndex--;
        updateCarousel();
      }
    });

    nextBtn.addEventListener("click", () => {
      if (currentIndex < totalItems) {
        currentIndex++;
        updateCarousel();
      }
    });

    // Перетаскивание
    const startDrag = (e) => {
      isDragging = true;
      startX = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
      prevTranslate = currentTranslate;
      container.style.transition = "none";
    };

    const drag = (e) => {
      if (!isDragging) return;
      const currentX = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
      const delta = currentX - startX;
      currentTranslate = prevTranslate + delta;
      setSliderPosition();
    };

    const endDrag = () => {
      if (!isDragging) return;
      isDragging = false;

      const movedBy = currentTranslate - prevTranslate;

      if (movedBy < -itemWidth / 4 && currentIndex < totalItems) {
        currentIndex++;
      }

      if (movedBy > itemWidth / 4 && currentIndex > -1) {
        currentIndex--;
      }

      updateCarousel();
    };

    // События для мыши
    container.addEventListener("mousedown", startDrag);
    container.addEventListener("mousemove", drag);
    container.addEventListener("mouseup", endDrag);
    container.addEventListener("mouseleave", endDrag);

    // События для сенсорного экрана
    container.addEventListener("touchstart", startDrag);
    container.addEventListener("touchmove", drag);
    container.addEventListener("touchend", endDrag);

    // Добавляем обработчик конца анимации
    container.addEventListener("transitionend", handleTransitionEnd);

    // Устанавливаем начальное положение
    setSliderPosition();
  });
});

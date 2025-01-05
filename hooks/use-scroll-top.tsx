import { useState, useEffect } from "react";

export const useScrollTop = (threshold = 80) => {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setVisible(window.scrollY > threshold);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [threshold]);

	return visible;
};

const ExtLink = ({ link, content, icon }) => {
	return (
		<a
			className={icon ? "ext-link arrow" : "ext-link"}
			href={link}
			target="_blank"
			rel="noreferrer"
		>
			{content}{icon}
		</a>
	)
}

export default ExtLink
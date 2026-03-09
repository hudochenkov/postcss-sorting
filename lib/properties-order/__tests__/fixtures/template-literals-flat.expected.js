// Only first group is unordered
const Component = styled.div`
	top: 0;
	z-index: 2;
	${props => props.great && 'color: red'};
	position: absolute;
	display: block;
`;

// Only second group is unordered
const Component2 = styled.div`
	top: 0;
	z-index: 2;
	${props => props.great && 'color: red'};
	position: absolute;
	display: block;
`;

// Both groups are unordered
const Component3 = styled.div`
	top: 0;
	z-index: 2;
	${props => props.great && 'color: red'};
	position: absolute;
	display: block;
`;

// Interpolation at the top
const Component4 = styled.div`
	${props => props.great && 'color: red'}
	position: absolute;
	top: 0;
`;

// Interpolation at the bottom
const Component5 = styled.div`
	position: absolute;
	top: 0;
	${props => props.great && 'color: red'}
`;

// Three groups
const Component6 = styled.div`
	top: 0;
	z-index: 2;
	${props => props.great && 'color: red'}
	position: absolute;
	display: block;
	${props => props.great && 'color: blue'}
	top: 0;
	display: block;
`;

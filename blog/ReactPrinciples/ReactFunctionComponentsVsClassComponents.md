Encapsulate a lazy-loaded picture component (examples only, practical use also needs to be optimized)
1. Function component implementation
```tsx
const Img = ({ src = 'default.png' }: { src: string }) => {
  const [displaySrc, setDisplaySrc] = useState<string>(null)
  const ref = useRef<HTMLImageElement>()

  useEffect(() => {
    const io = new IntersectionObserver(() => setDisplaySrc(src))
    io.observe(ref.current)
    return () => {
      io.unobserve(ref.current)
    }
  }, [src])

  return <img ref={ref} src={displaySrc} />
}
```
2. Class component implementation
```tsx
interface ImgProps {
  src: string
}

class Img extends React.Component<ImgProps, { displaySrc: string }> {
  static defaultProps = {
    src: 'default.png',
  }
  io: IntersectionObserver = null
  ref: React.RefObject<HTMLImageElement> = null

  constructor(props: Img2Props) {
    super(props)
    this.state = {
      displaySrc: null,
    }
    this.ref = React.createRef<HTMLImageElement>()
  }

  updateEffect = () => {
    const { src } = this.props
    if (this.state.displaySrc !== src) {
      // update observer
      if (this.io) {
        this.io.unobserve(this.ref.current)
        this.io = null
      }
      this.io = new IntersectionObserver(() =>
        this.setState({ displaySrc: src })
      )
      this.io.observe(this.ref.current)
    }
  }
  componentDidUpdate() {
    this.updateEffect()
  }
  componentDidMount() {
    this.updateEffect()
  }
  componentWillUnmount() {
    if (this.io) {
      this.io.unobserve(this.ref.current)
      this.io = null
    }
  }

  render() {
    const { displaySrc } = this.state
    return <img ref={this.ref} src={displaySrc} />
  }
}
```
Class components are more concerned with life cycle, while functional components are more concerned with data flow and side effects handling. Due to the existence of custom hooks, the logical abstraction and reuse of function components is much easier than class components.
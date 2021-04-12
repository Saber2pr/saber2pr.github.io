封装一个懒加载的图片组件(仅示例，实际使用还需要优化)

1. 函数组件实现

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

2. class 组件实现

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

class 组件更关注生命周期，函数组件更关注数据流和副作用处理。由于自定义 hooks 的存在，函数组件的逻辑抽离和复用要比 class 组件容易得多。

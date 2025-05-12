import { useTestServerComponent } from './styles/server-loader'



export function TestServerComponent() {
    const styles = useTestServerComponent();
    
    return (
        <button className={styles.main}>
            Test 2
        </button>
    );
}